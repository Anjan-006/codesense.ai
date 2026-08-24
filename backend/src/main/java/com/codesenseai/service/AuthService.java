package com.codesenseai.service;

import com.codesenseai.common.exception.BadRequestException;
import com.codesenseai.common.exception.ResourceNotFoundException;
import com.codesenseai.common.exception.UnauthorizedException;
import com.codesenseai.domain.entity.Session;
import com.codesenseai.domain.entity.User;
import com.codesenseai.domain.repository.SessionRepository;
import com.codesenseai.domain.repository.UserRepository;
import com.codesenseai.dto.mapper.UserMapper;
import com.codesenseai.dto.request.*;
import com.codesenseai.dto.response.AuthResponse;
import com.codesenseai.dto.response.UserResponse;
import com.codesenseai.security.jwt.JwtProperties;
import com.codesenseai.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Handles all authentication operations: register, login, token refresh,
 * email verification, and password reset.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final JwtTokenProvider tokenProvider;
    private final JwtProperties jwtProperties;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final EmailService emailService;

    // ─── Register ───────────────────────────────────────────────

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .verificationToken(verificationToken)
                .emailVerified(true) // Set true for dev; change to false in production
                .build();

        User saved = userRepository.save(user);

        // Send verification email (mock for now)
        emailService.sendVerificationEmail(saved.getEmail(), verificationToken);

        log.info("User registered: {}", saved.getEmail());
        return userMapper.toResponse(saved);
    }

    // ─── Login ──────────────────────────────────────────────────

    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress, String userAgent) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        String accessToken = tokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        // Store refresh token as a session
        Session session = Session.builder()
                .userId(user.getId())
                .refreshToken(refreshToken)
                .deviceInfo(userAgent)
                .ipAddress(ipAddress)
                .expiresAt(LocalDateTime.now().plusSeconds(
                        jwtProperties.getRefreshTokenExpirationMs() / 1000))
                .build();
        sessionRepository.save(session);

        log.info("User logged in: {}", user.getEmail());
        return AuthResponse.of(accessToken, refreshToken, userMapper.toResponse(user));
    }

    // ─── Refresh Token ──────────────────────────────────────────

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshTokenStr = request.getRefreshToken();

        if (!tokenProvider.validateToken(refreshTokenStr)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        Session session = sessionRepository.findByRefreshToken(refreshTokenStr)
                .orElseThrow(() -> new UnauthorizedException("Refresh token not found"));

        if (!session.isValid()) {
            throw new UnauthorizedException("Refresh token has been revoked or expired");
        }

        UUID userId = tokenProvider.getUserIdFromToken(refreshTokenStr);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Generate new tokens
        String newAccessToken = tokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getId());

        // Revoke old session, create new one
        session.setRevoked(true);
        sessionRepository.save(session);

        Session newSession = Session.builder()
                .userId(user.getId())
                .refreshToken(newRefreshToken)
                .deviceInfo(session.getDeviceInfo())
                .ipAddress(session.getIpAddress())
                .expiresAt(LocalDateTime.now().plusSeconds(
                        jwtProperties.getRefreshTokenExpirationMs() / 1000))
                .build();
        sessionRepository.save(newSession);

        log.info("Token refreshed for user: {}", user.getEmail());
        return AuthResponse.of(newAccessToken, newRefreshToken, userMapper.toResponse(user));
    }

    // ─── Logout ─────────────────────────────────────────────────

    @Transactional
    public void logout(String refreshToken) {
        sessionRepository.findByRefreshToken(refreshToken)
                .ifPresent(session -> {
                    session.setRevoked(true);
                    sessionRepository.save(session);
                    log.info("User logged out, session revoked");
                });
    }

    // ─── Email Verification ─────────────────────────────────────

    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        log.info("Email verified for user: {}", user.getEmail());
    }

    // ─── Forgot Password ───────────────────────────────────────

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .ifPresent(user -> {
                    String resetToken = UUID.randomUUID().toString();
                    user.setResetToken(resetToken);
                    user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
                    userRepository.save(user);

                    emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
                    log.info("Password reset requested for: {}", user.getEmail());
                });
        // Always return success to prevent email enumeration
    }

    // ─── Reset Password ────────────────────────────────────────

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (user.getResetTokenExpiry() == null ||
                LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            throw new BadRequestException("Reset token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        // Revoke all existing sessions for security
        sessionRepository.revokeAllByUserId(user.getId());

        log.info("Password reset completed for: {}", user.getEmail());
    }
}
