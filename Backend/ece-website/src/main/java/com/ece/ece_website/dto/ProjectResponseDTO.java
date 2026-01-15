package com.ece.ece_website.dto;

import com.ece.ece_website.entity.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ProjectResponseDTO {
    private UUID uuid;
    private String title;
    private long budget;
    private String description;
    private String image;
    private String pdfUrl;
    private String quickSummary;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> partners;
    private ProjectStatus status;
    private LocalDateTime date;
}
