package com.codesenseai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Email service — currently logs to console for development.
 * Replace with SMTP or SendGrid/Resend in production.
 */
@Slf4j
@Service
public class EmailService {

    public void sendVerificationEmail(String email, String token) {
        // TODO: Replace with actual email sending in production
        String verificationUrl = "http://localhost:5173/verify-email?token=" + token;
        log.info("═══════════════════════════════════════════════════");
        log.info("📧 VERIFICATION EMAIL");
        log.info("To: {}", email);
        log.info("Link: {}", verificationUrl);
        log.info("═══════════════════════════════════════════════════");
    }

    public void sendPasswordResetEmail(String email, String token) {
        // TODO: Replace with actual email sending in production
        String resetUrl = "http://localhost:5173/reset-password?token=" + token;
        log.info("═══════════════════════════════════════════════════");
        log.info("📧 PASSWORD RESET EMAIL");
        log.info("To: {}", email);
        log.info("Link: {}", resetUrl);
        log.info("═══════════════════════════════════════════════════");
    }
}
