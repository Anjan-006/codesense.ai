package com.codesenseai.controller;

import com.codesenseai.common.response.ApiResponse;
import com.codesenseai.dto.response.UserResponse;
import com.codesenseai.security.UserPrincipal;
import com.codesenseai.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal) {
        UserResponse user = userService.getCurrentUser(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/me")
    @Operation(summary = "Update user profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> updates) {
        UserResponse user = userService.updateProfile(
                principal.getId(),
                updates.get("firstName"),
                updates.get("lastName"));
        return ResponseEntity.ok(ApiResponse.success("Profile updated", user));
    }

    @PutMapping("/me/password")
    @Operation(summary = "Change password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> passwords) {
        userService.changePassword(
                principal.getId(),
                passwords.get("currentPassword"),
                passwords.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }
}
