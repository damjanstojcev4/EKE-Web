package com.ece.ece_website.dto;

import com.ece.ece_website.entity.Project;

public class ProjectMapper {

    public static ProjectResponseDTO toDTO(Project project) {
        return new ProjectResponseDTO(
                project.getUuid(),
                project.getTitle(),
                project.getBudget(),
                project.getDescription(),
                project.getQuickSummary(),
                project.getDurationDate(),
                project.getDate(),
                project.getPartners()
        );
    }

    public static Project fromDTO(ProjectRequestDTO dto) {
        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setBudget(dto.getBudget());
        project.setDescription(dto.getDescription());
        project.setQuickSummary(dto.getQuickSummary());
        project.setDurationDate(dto.getDurationDate());
        project.setPartners(dto.getPartners());
        return project;
    }
}
