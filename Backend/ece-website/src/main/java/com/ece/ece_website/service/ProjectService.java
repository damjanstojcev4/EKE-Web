package com.ece.ece_website.service;

import com.ece.ece_website.dto.ProjectMapper;
import com.ece.ece_website.dto.ProjectRequestDTO;
import com.ece.ece_website.dto.ProjectResponseDTO;
import com.ece.ece_website.entity.Project;
import com.ece.ece_website.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Project findByName(String title) {
        return projectRepository.findByTitle(title)
                .orElseThrow(() -> new RuntimeException("Project with name " + title + " not found"));

        // use custom exception class
        // and DTO to throw error code and not crash the app
    }

    public Project findByUuid(UUID uuid) {
        return projectRepository.findByUuid(uuid)
                .orElseThrow(() -> new RuntimeException("Project with uuid " + uuid + " not found"));
    }

    public Project save(Project project) {
        return projectRepository.save(project);
    }

    public ProjectResponseDTO updateProject(UUID uuid, ProjectRequestDTO dto) {
        Project project = projectRepository.findByUuid(uuid)
                .orElseThrow(() -> new RuntimeException("Project with UUID " + uuid + " not found"));

        project.setTitle(dto.getTitle());
        project.setBudget(dto.getBudget());
        project.setDescription(dto.getDescription());
        project.setQuickSummary(dto.getQuickSummary());
        project.setDurationDate(dto.getDurationDate());
        project.setPartners(dto.getPartners());

        if (dto.getStatus() != null) {
            project.setStatus(dto.getStatus());
        }
        // If status not sent in DTO, keep current status as is

        Project updatedProject = projectRepository.save(project);

        return ProjectMapper.toDTO(updatedProject);
    }

    public void deleteProject(UUID uuid) {
        Project project = projectRepository.findByUuid(uuid)
                .orElseThrow(() -> new RuntimeException("Project with UUID " + uuid + " not found"));

        projectRepository.delete(project);
    }
}
