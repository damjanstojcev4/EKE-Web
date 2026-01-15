package com.ece.ece_website.dto;

import com.ece.ece_website.entity.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequestDTO {
    private String title;
    private long budget;
    private String description;
    private String quickSummary;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> partners;
    private ProjectStatus status;
}
