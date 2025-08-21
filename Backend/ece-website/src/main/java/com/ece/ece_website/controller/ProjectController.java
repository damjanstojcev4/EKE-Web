package com.ece.ece_website.controller;

import com.ece.ece_website.dto.ProjectMapper;
import com.ece.ece_website.dto.ProjectResponseDTO;
import com.ece.ece_website.entity.Project;
import com.ece.ece_website.entity.ProjectStatus;
import com.ece.ece_website.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private static final String IMAGE_UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/images/";
    private static final String PDF_UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/pdf/";



    @Autowired
    private ProjectService projectService;

    @GetMapping("/")
    List<ProjectResponseDTO> getAllProjects() {
        return projectService.findAll()
                .stream()
                .map(ProjectMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/{title}")
    public Project getProjectByTitle(@PathVariable String title) {
        return projectService.findByName(title);
    }

    @GetMapping("/recent")
    public List<ProjectResponseDTO> getRecentProjects() {
        return projectService.latestProject()
                .stream()
                .map(ProjectMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/get/{uuid}")
    public ResponseEntity<ProjectResponseDTO> getProjectByUuid(@PathVariable UUID uuid) {
        ProjectResponseDTO projectResponseDTO = projectService.findByUuid(uuid);
        return ResponseEntity.ok(projectResponseDTO);
    }

    @PutMapping(value = "{uuid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> updateProject(
            @PathVariable UUID uuid,
            @RequestParam("title") String title,
            @RequestParam("budget") int budget,
            @RequestParam("description") String description,
            @RequestParam("quickSummary") String quickSummary,
            @RequestParam("durationDate") String durationDate,
            @RequestParam("partners") List<String> partners,
            @RequestParam("status") ProjectStatus status,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "pdf", required = false) MultipartFile pdfFile) throws IOException {

        Project existing = projectService.findEntityByUuid(uuid);

        existing.setTitle(title);
        existing.setBudget(budget);
        existing.setDescription(description);
        existing.setQuickSummary(quickSummary);
        existing.setDurationDate(durationDate);
        existing.setPartners(partners);
        existing.setStatus(status);

        new File(IMAGE_UPLOAD_DIR).mkdirs();
        new File(PDF_UPLOAD_DIR).mkdirs();

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            String imageFilePath = IMAGE_UPLOAD_DIR + imageFileName;
            imageFile.transferTo(new File(imageFilePath));
            existing.setImageFilePath(imageFileName);
        }

        if (pdfFile != null && !pdfFile.isEmpty()) {
            String pdfFileName = UUID.randomUUID() + "_" + pdfFile.getOriginalFilename();
            String pdfFilePath = PDF_UPLOAD_DIR + pdfFileName;
            pdfFile.transferTo(new File(pdfFilePath));
            existing.setPdfFilePath(pdfFileName);
        }

        Project updated = projectService.save(existing);

        return ResponseEntity.ok(ProjectMapper.toDTO(updated));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID uuid) {
        projectService.deleteProject(uuid);

        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> addProject(
            @RequestParam("title") String title,
            @RequestParam("budget") long budget,
            @RequestParam("description") String description,
            @RequestParam("quickSummary") String quickSummary,
            @RequestParam("durationDate") String durationDate,
            @RequestParam("partners") List<String> partners,
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam(value = "pdf", required = false) MultipartFile pdfFile,
            @RequestParam(value = "status", required = false, defaultValue = "ON GOING") String statusStr) throws IOException {

        new File(IMAGE_UPLOAD_DIR).mkdirs();
        new File(PDF_UPLOAD_DIR).mkdirs();

        String imageFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        String imageFilePath = IMAGE_UPLOAD_DIR + imageFileName;
        imageFile.transferTo(new File(imageFilePath));

        String pdfFileName = null;
        if (pdfFile != null && !pdfFile.isEmpty()) {
            pdfFileName = UUID.randomUUID() + "_" + pdfFile.getOriginalFilename();
            String pdfFilePath = PDF_UPLOAD_DIR + pdfFileName;
            pdfFile.transferTo(new File(pdfFilePath));
        }

        // Map status string to enum
        ProjectStatus status;
        try {
            status = ProjectStatus.valueOf(statusStr.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            status = ProjectStatus.ON_GOING;
        }

        // Save to DB
        Project project = new Project();
        project.setTitle(title);
        project.setBudget(budget);
        project.setDescription(description);
        project.setQuickSummary(quickSummary);
        project.setDurationDate(durationDate);
        project.setPartners(partners);
        project.setImageFilePath(imageFileName); // store image filename
        project.setPdfFilePath(pdfFileName);     // store PDF filename
        project.setStatus(status);

        Project saved = projectService.save(project);

        return ResponseEntity.ok(ProjectMapper.toDTO(saved));
    }

}

