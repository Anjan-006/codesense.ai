package com.codesenseai.dto.mapper;

import com.codesenseai.domain.entity.User;
import com.codesenseai.dto.response.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .role(user.getRole())
                .emailVerified(user.isEmailVerified())
                .avatarUrl(user.getAvatarUrl())
                .storageUsedBytes(user.getStorageUsedBytes())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
