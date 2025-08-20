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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/projects")
public class ProjectController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/images/";


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
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "pdf", required = false) MultipartFile pdfFile) throws IOException {

        Project existing = projectService.findEntityByUuid(uuid);

        // Update fields
        existing.setTitle(title);
        existing.setBudget(budget);
        existing.setDescription(description);
        existing.setQuickSummary(quickSummary);
        existing.setDurationDate(durationDate);
        existing.setPartners(partners);
        existing.setStatus(status);

        // Handle image upload if present
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path imagePath = Paths.get(UPLOAD_DIR, imageFileName);
            Files.createDirectories(imagePath.getParent());
            Files.copy(imageFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            existing.setImageFilePath(imageFileName);
        }

        // Handle PDF upload if present
        if (pdfFile != null && !pdfFile.isEmpty()) {
            String pdfFileName = UUID.randomUUID() + "_" + pdfFile.getOriginalFilename();
            Path pdfPath = Paths.get(UPLOAD_DIR, pdfFileName);
            Files.createDirectories(pdfPath.getParent());
            Files.copy(pdfFile.getInputStream(), pdfPath, StandardCopyOption.REPLACE_EXISTING);
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
            @RequestParam(value = "status", required = false, defaultValue = "ON GOING")String statusStr) throws IOException {

        // Make sure folders exist
        File imageDir = new File(UPLOAD_DIR);
        if (!imageDir.exists()) {
            imageDir.mkdirs();
        }

        // Check if folder exists
        File pdfDir = new File(UPLOAD_DIR + "pdf/");
        if (!pdfDir.exists()) {
            pdfDir.mkdirs();
        }

        // Save image
        String imageFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        String imageFilePath = UPLOAD_DIR + imageFileName;
        imageFile.transferTo(new File(imageFilePath));

        // Save PDF if provided
        String pdfFileName = null;
        if (pdfFile != null && !pdfFile.isEmpty()) {
            pdfFileName = UUID.randomUUID() + "_" + pdfFile.getOriginalFilename();
            String pdfFilePath = pdfDir.getAbsolutePath() + File.separator + pdfFileName;
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
        project.setImageFilePath(imageFileName);
        project.setPdfFilePath(pdfFileName); // store PDF path in DB
        project.setStatus(status);

        Project saved = projectService.save(project);

        return ResponseEntity.ok(ProjectMapper.toDTO(saved));
    }

}

