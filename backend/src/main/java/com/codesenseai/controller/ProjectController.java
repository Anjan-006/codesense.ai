package com.codesenseai.controller;

import com.codesenseai.common.response.ApiResponse;
import com.codesenseai.dto.request.ChatRequest;
import com.codesenseai.dto.request.CreateProjectRequest;
import com.codesenseai.dto.response.ProjectResponse;
import com.codesenseai.security.UserPrincipal;
import com.codesenseai.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Project management: upload ZIP, connect GitHub, list, delete")
public class ProjectController {

    private final ProjectService projectService;

    /** Upload a ZIP file to create a new project. */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a ZIP project")
    public ResponseEntity<ApiResponse<ProjectResponse>> uploadZip(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File is empty"));
        }
        if (!file.getOriginalFilename().endsWith(".zip")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Only ZIP files are accepted"));
        }

        ProjectResponse response = projectService.createFromZip(
                principal.getId(), name, description, file);
        return ResponseEntity.ok(ApiResponse.success("Project uploaded successfully", response));
    }

    /** Connect a GitHub repository to create a new project. */
    @PostMapping("/github")
    @Operation(summary = "Connect a GitHub repository")
    public ResponseEntity<ApiResponse<ProjectResponse>> connectGithub(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateProjectRequest req) {

        ProjectResponse response = projectService.createFromGithub(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.success("GitHub project created successfully", response));
    }

    /** List all projects for the authenticated user. */
    @GetMapping
    @Operation(summary = "List my projects")
    public ResponseEntity<ApiResponse<Page<ProjectResponse>>> listProjects(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ProjectResponse> projects = projectService.listProjects(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    /** Get a single project. */
    @GetMapping("/{id}")
    @Operation(summary = "Get a project by ID")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {

        ProjectResponse response = projectService.getProject(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /** Delete a project. */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {

        projectService.deleteProject(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted"));
    }

    /** Chat with AI about the project. */
    @PostMapping("/{id}/chat")
    @Operation(summary = "Chat with AI about the project")
    public ResponseEntity<ApiResponse<String>> chatWithProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody ChatRequest request) {

        String response = projectService.chatWithProject(principal.getId(), id, request.getMessage());
        return ResponseEntity.ok(ApiResponse.success("Success", response));
    }
}
