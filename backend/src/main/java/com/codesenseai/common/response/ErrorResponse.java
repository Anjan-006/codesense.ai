package com.codesenseai.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Structured error response with field-level validation errors.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private boolean success;
    private String message;
    private int status;
    private String path;
    private Map<String, String> errors;
    private List<String> details;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static ErrorResponse of(String message, int status, String path) {
        return ErrorResponse.builder()
                .success(false)
                .message(message)
                .status(status)
                .path(path)
                .build();
    }

    public static ErrorResponse validation(String message, int status, String path,
                                           Map<String, String> errors) {
        return ErrorResponse.builder()
                .success(false)
                .message(message)
                .status(status)
                .path(path)
                .errors(errors)
                .build();
    }
}
