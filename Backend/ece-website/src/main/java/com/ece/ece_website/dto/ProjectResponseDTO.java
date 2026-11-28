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
    private boolean published;
    private String slug;
    private String programme;
    private java.math.BigDecimal grantValue;
    private String currency;
    private String countries;
    private String keyAction;
    private String actionType;
    private String website;
    private String topics;
    private String contentJson;
    private String logoFilePath;
    private String imageAlt;
    private String downloadDescription;
    private String resourcesJson;
    private String partnerMediaJson;
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
