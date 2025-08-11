package com.ece.ece_website.dto;

import com.ece.ece_website.entity.ProjectStatus;
import lombok.Data;

import java.util.List;

@Data
public class ProjectUpdateRequestDTO {
    private String title;
    private long budget;
    private String description;
    private String quickSummary;
    private String durationDate;
    private List<String> partners;
    private ProjectStatus status; // Enum type
}
