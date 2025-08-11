package com.ece.ece_website.controller;

import com.ece.ece_website.dto.ProjectMapper;
import com.ece.ece_website.dto.ProjectRequestDTO;
import com.ece.ece_website.dto.ProjectResponseDTO;
import com.ece.ece_website.dto.ProjectUpdateRequestDTO;
import com.ece.ece_website.entity.Project;
import com.ece.ece_website.entity.ProjectStatus;
import com.ece.ece_website.service.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController("/")
public class ProjectController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/images/";


    @Autowired
    private ProjectService projectService;

    @GetMapping
    List<ProjectResponseDTO> getAllProjects() {
        return projectService.findAll()
                .stream()
                .map(ProjectMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PutMapping(value = "/{uuid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> updateProject(
            @PathVariable UUID uuid,
            @RequestParam("title") String title,
            @RequestParam("budget") int budget,
            @RequestParam("description") String description,
            @RequestParam("quickSummary") String quickSummary,
            @RequestParam("durationDate") String durationDate,
            @RequestParam("partners") List<String> partners,
            @RequestParam("status") ProjectStatus status,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        Project existing = projectService.findByUuid(uuid);

        existing.setTitle(title);
        existing.setBudget(budget);
        existing.setDescription(description);
        existing.setQuickSummary(quickSummary);
        existing.setDurationDate(durationDate);
        existing.setPartners(partners);
        existing.setStatus(status);

        // If image is uploaded → replace, else keep the old one
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path imagePath = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(imagePath.getParent());
            Files.copy(imageFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            existing.setImageFilePath(fileName);
        }

        Project updated = projectService.save(existing);

        return ResponseEntity.ok(ProjectMapper.toDTO(updated));
    }

    @DeleteMapping("{uuid}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID uuid) {
        projectService.deleteProject(uuid);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/projects")
    public ResponseEntity<ProjectResponseDTO> addProject(
            @RequestParam("title") String title,
            @RequestParam("budget") long budget,
            @RequestParam("description") String description,
            @RequestParam("quickSummary") String quickSummary,
            @RequestParam("durationDate") String durationDate,
            @RequestParam("partners") List<String> partners,
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam(value = "status", required = false, defaultValue = "ON GOING")String statusStr) throws IOException {

        // Make sure folder exists
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Create unique file name
        String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        String filePath = UPLOAD_DIR + fileName;

        // Save file to disk
        imageFile.transferTo(new File(filePath));

        // Map status string to enum, default to ONGOING if invalid
        ProjectStatus status;
        try {
            status = ProjectStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            status = ProjectStatus.ON_GOING;
        }

        // Save project data in DB
        Project project = new Project();
        project.setTitle(title);
        project.setBudget(budget);
        project.setDescription(description);
        project.setQuickSummary(quickSummary);
        project.setDurationDate(durationDate);
        project.setPartners(partners);
        project.setImageFilePath(fileName); // public path

        Project saved = projectService.save(project);

        return ResponseEntity.ok(ProjectMapper.toDTO(saved));
    }

}

