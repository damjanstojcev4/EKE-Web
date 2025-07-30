package com.ece.ece_website.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProjectRequestDTO {
    private String title;
    private long budget;
    private String description;
    private String quickSummary;
    private String durationDate;
    List<String> partners;
}
