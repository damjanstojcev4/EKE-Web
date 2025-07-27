package com.ece.ece_website.controller;

import com.ece.ece_website.entity.Project;
import com.ece.ece_website.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("/")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    List<Project> getProjects() {
        return projectService.findAll();
    }

    @PostMapping()
    Project addProject(@RequestBody Project project) {
        return projectService.save(project);
    }
}
