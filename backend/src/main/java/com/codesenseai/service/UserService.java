package com.codesenseai.service;

import com.codesenseai.common.exception.ResourceNotFoundException;
import com.codesenseai.domain.entity.User;
import com.codesenseai.domain.repository.UserRepository;
import com.codesenseai.dto.mapper.UserMapper;
import com.codesenseai.dto.response.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, String firstName, String lastName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (firstName != null) user.setFirstName(firstName.trim());
        if (lastName != null) user.setLastName(lastName.trim());

        User updated = userRepository.save(user);
        log.info("Profile updated for user: {}", updated.getEmail());
        return userMapper.toResponse(updated);
    }

    @Transactional
    public void changePassword(UUID userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new com.codesenseai.common.exception.BadRequestException(
                    "Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password changed for user: {}", user.getEmail());
    }
}
