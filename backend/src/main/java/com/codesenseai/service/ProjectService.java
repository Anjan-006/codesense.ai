package com.codesenseai.service;

import com.codesenseai.common.enums.ProjectStatus;
import com.codesenseai.common.enums.SourceType;
import com.codesenseai.common.exception.ResourceNotFoundException;
import com.codesenseai.domain.entity.Project;
import com.codesenseai.domain.repository.ProjectRepository;
import com.codesenseai.dto.request.CreateProjectRequest;
import com.codesenseai.dto.response.ProjectResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.codesenseai.domain.entity.ProjectFile;
import com.codesenseai.domain.repository.ProjectFileRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final GitHubCloneService githubCloneService;
    private final ProjectFileRepository projectFileRepository;

    /** Create a project from a GitHub URL. */
    public ProjectResponse createFromGithub(UUID userId, CreateProjectRequest req) {
        if (req.getGithubUrl() == null || req.getGithubUrl().isBlank()) {
            throw new IllegalArgumentException("GitHub URL is required for GITHUB source type");
        }

        Project project = Project.builder()
                .userId(userId)
                .name(req.getName())
                .description(req.getDescription())
                .sourceType(SourceType.GITHUB)
                .githubUrl(req.getGithubUrl())
                .status(ProjectStatus.UPLOADING)
                .build();

        project = projectRepository.save(project);
        log.info("Created GitHub project {} for user {}", project.getId(), userId);

        // Trigger async GitHub clone + indexing pipeline
        githubCloneService.cloneRepo(project.getId());

        return toResponse(project);
    }

    /** Create a project from a ZIP file upload. */
    public ProjectResponse createFromZip(UUID userId, String name, String description, MultipartFile file) {
        Project project = Project.builder()
                .userId(userId)
                .name(name)
                .description(description)
                .sourceType(SourceType.ZIP_UPLOAD)
                .status(ProjectStatus.UPLOADING)
                .totalSizeBytes(file.getSize())
                .build();

        project = projectRepository.save(project);
        log.info("Created ZIP project {} ({} bytes) for user {}", project.getId(), file.getSize(), userId);

        try {
            // Save MultipartFile to a temporary file
            Path tempFile = Files.createTempFile("upload-", ".zip");
            file.transferTo(tempFile.toFile());

            // Trigger async ZIP extraction + indexing pipeline
            githubCloneService.processUploadedZipAsync(project.getId(), tempFile);
        } catch (IOException e) {
            log.error("Failed to store uploaded ZIP file for project {}: {}", project.getId(), e.getMessage(), e);
            project.setStatus(ProjectStatus.FAILED);
            projectRepository.save(project);
            throw new RuntimeException("Failed to store uploaded file", e);
        }

        return toResponse(project);
    }

    /** List all projects for a user (paginated). */
    @Transactional(readOnly = true)
    public Page<ProjectResponse> listProjects(UUID userId, Pageable pageable) {
        return projectRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toResponse);
    }

    /** Get a single project by ID, checking ownership. */
    @Transactional(readOnly = true)
    public ProjectResponse getProject(UUID userId, UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        if (!project.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Project", "id", projectId);
        }
        return toResponse(project);
    }

    /** Delete a project by ID, checking ownership. */
    @Transactional
    public void deleteProject(UUID userId, UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        if (!project.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Project", "id", projectId);
        }
        projectRepository.delete(project);
        log.info("Deleted project {} for user {}", projectId, userId);
    }

    public String chatWithProject(UUID userId, UUID projectId, String userMessage) {
        // 1. Get the project and check ownership
        getProject(userId, projectId); // throws if not owner or not found
        
        // 2. Fetch all files of the project
        List<ProjectFile> files = projectFileRepository.findByProjectIdOrderByFilePath(projectId);
        if (files.isEmpty()) {
            return "This project has no source files indexed. Please check if files were uploaded correctly.";
        }

        // 3. Simple keyword matching to find the most relevant files (limit context size)
        StringBuilder context = new StringBuilder();
        int addedCount = 0;
        
        context.append("Codebase File Tree:\n");
        for (ProjectFile f : files) {
            context.append("- ").append(f.getFilePath()).append(" (").append(f.getLinesOfCode()).append(" lines)\n");
        }
        context.append("\nRelevant File Contents:\n");

        // Split user query into keywords to find matches
        String[] keywords = userMessage.toLowerCase().split("\\W+");
        List<ProjectFile> sortedFiles = new ArrayList<>(files);
        
        // Score files by keyword matches
        Map<UUID, Integer> scores = new HashMap<>();
        for (ProjectFile file : sortedFiles) {
            int score = 0;
            String lowerContent = file.getContent().toLowerCase();
            String lowerPath = file.getFilePath().toLowerCase();
            for (String kw : keywords) {
                if (kw.length() > 2) {
                    if (lowerPath.contains(kw)) score += 10;
                    if (lowerContent.contains(kw)) score += 1;
                }
            }
            scores.put(file.getId(), score);
        }
        
        sortedFiles.sort((f1, f2) -> scores.get(f2.getId()) - scores.get(f1.getId()));

        // Add contents of top 3 files (or files up to ~25,000 characters)
        int currentSize = 0;
        for (ProjectFile file : sortedFiles) {
            if (addedCount >= 3 || currentSize > 25000) break;
            
            if (scores.get(file.getId()) > 0 || addedCount == 0) {
                context.append("--- FILE: ").append(file.getFilePath()).append(" ---\n");
                context.append(file.getContent()).append("\n");
                currentSize += file.getContent().length();
                addedCount++;
            }
        }

        // 4. Call Gemini API using HttpClient
        String geminiKey = System.getenv("GEMINI_API_KEY");
        if (geminiKey == null || geminiKey.isBlank()) {
            return "Gemini API Key is not configured in backend .env file. Please check your setup.";
        }
        String geminiModel = System.getenv("GEMINI_MODEL");
        if (geminiModel == null || geminiModel.isBlank()) {
            geminiModel = "gemini-3.6-flash";
        }

        try {
            return callGeminiChat(geminiKey, geminiModel, context.toString(), userMessage);
        } catch (Exception e) {
            log.error("Failed to query Gemini: {}", e.getMessage(), e);
            if (e.getMessage() != null && (e.getMessage().contains("429") || e.getMessage().contains("quota"))) {
                return generateMockResponse(userMessage, files);
            }
            return "Error calling Gemini API: " + e.getMessage();
        }
    }

    private String callGeminiChat(String apiKey, String model, String context, String userQuery) throws Exception {
        java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
        
        String systemPrompt = "You are CodeSense AI, an expert senior software engineer and assistant. " +
                "Your task is to help the user understand their codebase. Use the codebase context provided to give detailed, " +
                "accurate answers with code references where appropriate.\n\n" +
                "CONTEXT:\n" + context;

        String payload = String.format(
            "{\"model\": %s, \"messages\": [" +
            "{\"role\": \"system\", \"content\": %s}," +
            "{\"role\": \"user\", \"content\": %s}" +
            "], \"temperature\": 0.2}",
            escapeJson(model),
            escapeJson(systemPrompt),
            escapeJson(userQuery)
        );

        java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(payload, java.nio.charset.StandardCharsets.UTF_8))
                .build();

        java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Gemini returned status " + response.statusCode() + ": " + response.body());
        }

        String body = response.body();
        int contentIdx = body.indexOf("\"content\":");
        if (contentIdx == -1) {
            return "Could not parse response from AI.";
        }
        String contentStart = body.substring(contentIdx + 11);
        StringBuilder result = new StringBuilder();
        boolean escaped = false;
        for (int i = 0; i < contentStart.length(); i++) {
            char c = contentStart.charAt(i);
            if (escaped) {
                if (c == 'n') result.append('\n');
                else if (c == 't') result.append('\t');
                else if (c == 'r') result.append('\r');
                else result.append(c);
                escaped = false;
            } else if (c == '\\') {
                escaped = true;
            } else if (c == '\"') {
                break;
            } else {
                result.append(c);
            }
        }

        return result.toString();
    }

    private String escapeJson(String str) {
        if (str == null) return "null";
        StringBuilder sb = new StringBuilder();
        sb.append("\"");
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            switch (c) {
                case '\\': sb.append("\\\\"); break;
                case '\"': sb.append("\\\""); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (c < ' ') {
                        String t = "000" + java.lang.Integer.toHexString(c);
                        sb.append("\\u").append(t.substring(t.length() - 4));
                    } else {
                        sb.append(c);
                    }
            }
        }
        sb.append("\"");
        return sb.toString();
    }

    // ─── Mapper ────────────────────────────────────────────────────
    private ProjectResponse toResponse(Project p) {
        return ProjectResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .sourceType(p.getSourceType())
                .githubUrl(p.getGithubUrl())
                .primaryLanguage(p.getPrimaryLanguage())
                .status(p.getStatus())
                .totalFiles(p.getTotalFiles())
                .totalSizeBytes(p.getTotalSizeBytes())
                .indexedFiles(p.getIndexedFiles())
                .frameworkDetected(p.getFrameworkDetected())
                .languageStats(p.getLanguageStats())
                .indexingProgress(p.getIndexingProgress())
                .storageSizeFormatted(formatBytes(p.getTotalSizeBytes()))
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    private String formatBytes(long bytes) {
        if (bytes == 0) return "0 B";
        String[] units = {"B", "KB", "MB", "GB"};
        int i = (int) (Math.log(bytes) / Math.log(1024));
        i = Math.min(i, units.length - 1);
        return String.format("%.1f %s", bytes / Math.pow(1024, i), units[i]);
    }

    private String generateMockResponse(String userMessage, List<ProjectFile> files) {
        String msg = userMessage.toLowerCase();
        
        if (msg.contains("structure") || msg.contains("file") || msg.contains("folders")) {
            StringBuilder sb = new StringBuilder();
            sb.append("### 📂 Codebase Structure & File Tree\n\n");
            sb.append("Here is the parsed layout of the project files:\n\n");
            for (ProjectFile f : files) {
                sb.append("*   `").append(f.getFilePath()).append("` (").append(f.getLanguage()).append(", ").append(f.getLinesOfCode()).append(" lines)\n");
            }
            sb.append("\nThis structure suggests a standard layout of a ").append(files.get(0).getLanguage()).append(" project.");
            return sb.toString();
        }
        
        if (msg.contains("explain") || msg.contains("what is") || msg.contains("how")) {
            ProjectFile codeFile = files.stream()
                .filter(f -> f.getFilePath().endsWith(".java") || f.getFilePath().endsWith(".js") || 
                             f.getFilePath().endsWith(".ts") || f.getFilePath().endsWith(".py") ||
                             f.getFilePath().endsWith(".html") || f.getFilePath().endsWith(".css"))
                .findFirst()
                .orElse(files.get(0));
                
            return "### 💡 Codebase Explanation\n\n" +
                   "Here is an overview of the codebase centered on your file `" + codeFile.getFilePath() + "`:\n\n" +
                   "1.  **Main Logic**: The primary configurations and scripts are defined in `" + codeFile.getFileName() + "`.\n" +
                   "2.  **Implementation**: It is developed using **" + codeFile.getLanguage() + "**.\n" +
                   "3.  **Highlights**: It includes structured codebase variables and styling classes.\n\n" +
                   "*(Note: This local mock explanation is served because the configured Gemini API key has exceeded its quota. Please check your Gemini API quota/billing for full answers!)*";
        }
        
        return "### 🤖 CodeSense AI Assistant\n\n" +
               "I scanned the project files, but I couldn't query Gemini because your API key is out of credits (429 quota exceeded).\n\n" +
               "Here is some codebase metadata I parsed locally:\n" +
               "*   Total Source Files: **" + files.size() + "**\n" +
               "*   Primary Language: **" + (files.isEmpty() ? "None" : files.get(0).getLanguage()) + "**\n\n" +
               "Please check your Gemini API account to unlock dynamic, conversational chat responses!";
    }
}
