package com.codesenseai.dto.request;

import com.codesenseai.common.enums.SourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateProjectRequest {

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    @NotNull(message = "Source type is required")
    private SourceType sourceType;

    /** Required when sourceType == GITHUB */
    private String githubUrl;
}
