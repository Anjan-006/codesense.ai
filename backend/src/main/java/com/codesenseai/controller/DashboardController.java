package com.codesenseai.controller;

import com.codesenseai.common.response.ApiResponse;
import com.codesenseai.dto.response.DashboardStatsResponse;
import com.codesenseai.security.UserPrincipal;
import com.codesenseai.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "User dashboard statistics and activity")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics for the current user")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats(
            @AuthenticationPrincipal UserPrincipal principal) {
        DashboardStatsResponse stats = dashboardService.getStats(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
