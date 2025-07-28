package com.ece.ece_website.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ProjectResponseDTO {
    private UUID uuid;
    private String title;
    private long budget;
    private String description;
    private String quickSummary;
    private LocalDate date;
}
