package com.codesenseai.dto.response;

import com.codesenseai.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private Role role;
    private boolean emailVerified;
    private String avatarUrl;
    private long storageUsedBytes;
    private LocalDateTime createdAt;
}
