package com.ece.ece_website.service;

import com.ece.ece_website.entity.Project;
import com.ece.ece_website.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Project findByName(String name) {
        return projectRepository.findByProjectName(name)
                .orElseThrow(() -> new RuntimeException("Project with name " + name + " not found"));

        // use custom exception class
        // and DTO to throw error code and not crash the app
    }

    public Project save(Project project) {
        return projectRepository.save(project);
    }
}
