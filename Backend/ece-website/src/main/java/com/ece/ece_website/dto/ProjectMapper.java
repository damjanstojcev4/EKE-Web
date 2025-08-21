package com.ece.ece_website.dto;

import com.ece.ece_website.entity.Project;

public class ProjectMapper {

    public static ProjectResponseDTO toDTO(Project project) {
        String imageUrl = null;
        if (project.getImageFilePath() != null) {
            imageUrl = "/api/uploads/images/" + project.getImageFilePath(); // full API path
        }

        String pdfFileUrl = null;
        if (project.getPdfFilePath() != null) {
            pdfFileUrl = "/api/uploads/pdf/" + project.getPdfFilePath(); // full API path
        }

        return new ProjectResponseDTO(
                project.getUuid(),
                project.getTitle(),
                project.getBudget(),
                project.getDescription(),
                imageUrl,
                project.getQuickSummary(),
                project.getDurationDate(),
                project.getPartners(),
                project.getStatus(),
                pdfFileUrl
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

        if (dto.getStatus() != null) {
            project.setStatus(dto.getStatus());
        }

        return project;
    }
}
