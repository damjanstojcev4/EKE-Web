package com.ece.ece_website.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
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
    private String quickSummary;
    private String durationDate;
    List<String> partners;
}
