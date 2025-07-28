package com.ece.ece_website.controller;

import com.ece.ece_website.entity.Project;
import com.ece.ece_website.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController("/")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    List<Project> getProjects() {
        return projectService.findAll();
    }

    @PostMapping()
    public ResponseEntity<Project> addProject(@RequestBody Project project) {
        Project savedProject = projectService.save(project);
        return new ResponseEntity<>(savedProject, HttpStatus.CREATED); // 201
    }
}
