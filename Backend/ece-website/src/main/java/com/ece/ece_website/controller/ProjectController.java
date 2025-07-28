package com.ece.ece_website.controller;

import com.ece.ece_website.dto.ProjectMapper;
import com.ece.ece_website.dto.ProjectRequestDTO;
import com.ece.ece_website.dto.ProjectResponseDTO;
import com.ece.ece_website.entity.Project;
import com.ece.ece_website.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController("/")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    List<ProjectResponseDTO> getAllProjects() {
        return projectService.findAll()
                .stream()
                .map(ProjectMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping()
    public ResponseEntity<ProjectResponseDTO> addProject(@RequestBody ProjectRequestDTO project) {
        Project savedProject = ProjectMapper.fromDTO(project);
        Project saved = projectService.save(savedProject);
        ProjectResponseDTO responseDTO = ProjectMapper.toDTO(saved);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED); // 201
    }
}
