package com.codesenseai.service;

import com.codesenseai.common.enums.ProjectStatus;
import com.codesenseai.domain.entity.Project;
import com.codesenseai.domain.entity.ProjectFile;
import com.codesenseai.domain.repository.ProjectFileRepository;
import com.codesenseai.domain.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * Downloads a GitHub repo as ZIP, extracts code files, and stores them
 * in the project_files table so the chat can reference them.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GitHubCloneService {

    private final ProjectRepository projectRepository;
    private final ProjectFileRepository projectFileRepository;

    private static final Set<String> CODE_EXTENSIONS = Set.of(
            ".java", ".py", ".js", ".ts", ".tsx", ".jsx", ".go", ".rs", ".c", ".cpp", ".h",
            ".cs", ".rb", ".php", ".swift", ".kt", ".scala", ".html", ".css", ".scss",
            ".sql", ".xml", ".json", ".yml", ".yaml", ".toml", ".md", ".txt", ".sh",
            ".bat", ".gradle", ".properties", ".cfg", ".ini", ".env", ".dockerfile"
    );

    private static final long MAX_FILE_SIZE = 500_000; // 500 KB per file

    /**
     * Asynchronously clone a GitHub repo by downloading its ZIP archive.
     */
    @Async
    public void cloneRepo(UUID projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return;

        try {
            project.setStatus(ProjectStatus.PROCESSING);
            projectRepository.save(project);

            String githubUrl = project.getGithubUrl();
            String zipUrl = buildZipUrl(githubUrl);
            log.info("Downloading GitHub repo ZIP from: {}", zipUrl);

            // Download ZIP
            HttpClient client = HttpClient.newBuilder()
                    .followRedirects(HttpClient.Redirect.ALWAYS)
                    .build();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(zipUrl))
                    .GET()
                    .build();
            HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());

            if (response.statusCode() != 200) {
                log.error("GitHub download failed with status: {}", response.statusCode());
                project.setStatus(ProjectStatus.FAILED);
                projectRepository.save(project);
                return;
            }

            // Extract and store files
            List<ProjectFile> files = extractFiles(projectId, response.body());
            projectFileRepository.saveAll(files);

            // Detect primary language
            Map<String, Integer> langStats = new HashMap<>();
            for (ProjectFile f : files) {
                if (f.getLanguage() != null) {
                    langStats.merge(f.getLanguage(), 1, Integer::sum);
                }
            }

            String primaryLang = langStats.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(null);

            long totalSize = files.stream().mapToLong(ProjectFile::getSizeBytes).sum();

            project.setStatus(ProjectStatus.READY);
            project.setTotalFiles(files.size());
            project.setIndexedFiles(files.size());
            project.setTotalSizeBytes(totalSize);
            project.setPrimaryLanguage(primaryLang);
            project.setLanguageStats(langStats);
            projectRepository.save(project);

            log.info("Successfully cloned GitHub repo. {} files indexed for project {}", files.size(), projectId);

        } catch (Exception e) {
            log.error("Failed to clone GitHub repo for project {}: {}", projectId, e.getMessage(), e);
            project.setStatus(ProjectStatus.FAILED);
            projectRepository.save(project);
        }
    }

    @Transactional
    public void extractUploadedZip(UUID projectId, InputStream zipStream) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return;

        try {
            project.setStatus(ProjectStatus.PROCESSING);
            projectRepository.save(project);

            List<ProjectFile> files = extractFiles(projectId, zipStream);
            projectFileRepository.saveAll(files);

            Map<String, Integer> langStats = new HashMap<>();
            for (ProjectFile f : files) {
                if (f.getLanguage() != null) langStats.merge(f.getLanguage(), 1, Integer::sum);
            }

            String primaryLang = langStats.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(null);

            long totalSize = files.stream().mapToLong(ProjectFile::getSizeBytes).sum();

            project.setStatus(ProjectStatus.READY);
            project.setTotalFiles(files.size());
            project.setIndexedFiles(files.size());
            project.setTotalSizeBytes(totalSize);
            project.setPrimaryLanguage(primaryLang);
            project.setLanguageStats(langStats);
            projectRepository.save(project);

            log.info("Extracted ZIP upload. {} files for project {}", files.size(), projectId);
        } catch (Exception e) {
            log.error("Failed to extract ZIP for project {}: {}", projectId, e.getMessage(), e);
            project.setStatus(ProjectStatus.FAILED);
            projectRepository.save(project);
        }
    }

    /**
     * Asynchronously extracts files from an uploaded ZIP using a temporary file.
     */
    @Async
    public void processUploadedZipAsync(UUID projectId, Path tempFilePath) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return;

        try {
            project.setStatus(ProjectStatus.PROCESSING);
            projectRepository.save(project);

            log.info("Asynchronously processing uploaded ZIP from: {}", tempFilePath);
            try (InputStream zipStream = Files.newInputStream(tempFilePath)) {
                List<ProjectFile> files = extractFiles(projectId, zipStream);
                projectFileRepository.saveAll(files);

                Map<String, Integer> langStats = new HashMap<>();
                for (ProjectFile f : files) {
                    if (f.getLanguage() != null) langStats.merge(f.getLanguage(), 1, Integer::sum);
                }

                String primaryLang = langStats.entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse(null);

                long totalSize = files.stream().mapToLong(ProjectFile::getSizeBytes).sum();

                project.setStatus(ProjectStatus.READY);
                project.setTotalFiles(files.size());
                project.setIndexedFiles(files.size());
                project.setTotalSizeBytes(totalSize);
                project.setPrimaryLanguage(primaryLang);
                project.setLanguageStats(langStats);
                projectRepository.save(project);

                log.info("Successfully processed ZIP upload. {} files indexed for project {}", files.size(), projectId);
            } finally {
                Files.deleteIfExists(tempFilePath);
            }
        } catch (Exception e) {
            log.error("Failed to process ZIP upload for project {}: {}", projectId, e.getMessage(), e);
            project.setStatus(ProjectStatus.FAILED);
            projectRepository.save(project);
            try { Files.deleteIfExists(tempFilePath); } catch (Exception ignored) {}
        }
    }

    // ─── Internal helpers ──────────────────────────────────────────

    private String buildZipUrl(String githubUrl) {
        // https://github.com/owner/repo → https://github.com/owner/repo/archive/refs/heads/main.zip
        String url = githubUrl.replaceAll("/+$", ""); // strip trailing slashes
        if (url.endsWith(".git")) url = url.substring(0, url.length() - 4);
        return url + "/archive/refs/heads/main.zip";
    }

    private List<ProjectFile> extractFiles(UUID projectId, InputStream inputStream) throws IOException {
        List<ProjectFile> files = new ArrayList<>();

        try (ZipInputStream zis = new ZipInputStream(new BufferedInputStream(inputStream))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                if (entry.isDirectory()) continue;

                String fullPath = entry.getName();
                // Strip the top-level directory (repo-main/)
                int slashIdx = fullPath.indexOf('/');
                String relativePath = slashIdx >= 0 ? fullPath.substring(slashIdx + 1) : fullPath;

                if (relativePath.isEmpty()) continue;
                if (shouldSkip(relativePath)) continue;

                String ext = getExtension(relativePath).toLowerCase();
                if (!CODE_EXTENSIONS.contains(ext)) continue;

                // Read content (limited size)
                byte[] bytes = readLimited(zis, MAX_FILE_SIZE);
                if (bytes.length == 0) continue;

                String content = new String(bytes, StandardCharsets.UTF_8);
                String fileName = relativePath.contains("/")
                        ? relativePath.substring(relativePath.lastIndexOf('/') + 1)
                        : relativePath;

                ProjectFile pf = ProjectFile.builder()
                        .projectId(projectId)
                        .filePath(relativePath)
                        .fileName(fileName)
                        .language(detectLanguage(ext))
                        .sizeBytes(bytes.length)
                        .linesOfCode(countLines(content))
                        .content(content)
                        .build();

                files.add(pf);
                zis.closeEntry();
            }
        }
        return files;
    }

    private boolean shouldSkip(String path) {
        String lower = path.toLowerCase();
        return lower.contains("node_modules/") || lower.contains(".git/") ||
               lower.contains("__pycache__/") || lower.contains("target/") ||
               lower.contains("build/") || lower.contains("dist/") ||
               lower.contains(".idea/") || lower.contains(".vscode/") ||
               lower.contains("vendor/") || lower.contains(".gradle/") ||
               lower.startsWith(".");
    }

    private String getExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot) : "";
    }

    private String detectLanguage(String ext) {
        return switch (ext) {
            case ".java" -> "Java";
            case ".py" -> "Python";
            case ".js" -> "JavaScript";
            case ".ts", ".tsx" -> "TypeScript";
            case ".jsx" -> "React JSX";
            case ".go" -> "Go";
            case ".rs" -> "Rust";
            case ".c", ".h" -> "C";
            case ".cpp" -> "C++";
            case ".cs" -> "C#";
            case ".rb" -> "Ruby";
            case ".php" -> "PHP";
            case ".swift" -> "Swift";
            case ".kt" -> "Kotlin";
            case ".scala" -> "Scala";
            case ".html" -> "HTML";
            case ".css", ".scss" -> "CSS";
            case ".sql" -> "SQL";
            case ".json" -> "JSON";
            case ".xml" -> "XML";
            case ".yml", ".yaml" -> "YAML";
            case ".md" -> "Markdown";
            case ".sh", ".bat" -> "Shell";
            default -> null;
        };
    }

    private int countLines(String content) {
        if (content == null || content.isEmpty()) return 0;
        return content.split("\n").length;
    }

    private byte[] readLimited(InputStream in, long maxBytes) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        byte[] buf = new byte[8192];
        long total = 0;
        int n;
        while ((n = in.read(buf)) > 0) {
            total += n;
            if (total > maxBytes) break;
            bos.write(buf, 0, n);
        }
        return bos.toByteArray();
    }
}
