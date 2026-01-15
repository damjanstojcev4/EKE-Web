package com.ece.ece_website.dto;

import com.ece.ece_website.entity.Project;

public class ProjectMapper {

    public static ProjectResponseDTO toDTO(Project project) {

        String imageUrl = project.getImageFilePath() != null
                ? "/api/uploads/images/" + project.getImageFilePath()
                : null;

        String pdfFileUrl = project.getPdfFilePath() != null
                ? "/api/uploads/pdf/" + project.getPdfFilePath()
                : null;

        return new ProjectResponseDTO(
                project.getUuid(),
                project.getTitle(),
                project.getBudget(),
                project.getDescription(),
                imageUrl,
                pdfFileUrl,
                project.getQuickSummary(),
                project.getStartDate(),
                project.getEndDate(),
                project.getPartners(),
                project.getStatus(),
                project.getDate()
        );
    }

    public static Project fromDTO(ProjectRequestDTO dto) {
        Project project = new Project();

        project.setTitle(dto.getTitle());
        project.setBudget(dto.getBudget());
        project.setDescription(dto.getDescription());
        project.setQuickSummary(dto.getQuickSummary());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setPartners(dto.getPartners());

        if (dto.getStatus() != null) {
            project.setStatus(dto.getStatus());
        }

        return project;
    }
}

