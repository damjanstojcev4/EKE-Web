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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
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

    @PutMapping(value = "/{uuid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> updateProject(
            @PathVariable UUID uuid,
            @RequestParam("title") String title,
            @RequestParam("budget") long budget,
            @RequestParam("description") String description,
            @RequestParam("quickSummary") String quickSummary,
            @RequestParam(value = "startDate", required = false) String startDate, // or LocalDate (recommended)
            @RequestParam(value = "endDate", required = false) String endDate, // or LocalDate (recommended)
            @RequestParam(value = "partners", required = false) List<String> partners,
            @RequestParam("status") ProjectStatus status,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "pdf", required = false) MultipartFile pdfFile) throws IOException {

        Project existing = projectService.findEntityByUuid(uuid);

        existing.setTitle(title);
        existing.setBudget(budget);
        existing.setDescription(description);
        existing.setQuickSummary(quickSummary);

        // Safe parsing for LocalDate
        if (startDate != null && !startDate.isBlank())
            existing.setStartDate(LocalDate.parse(startDate));
        if (endDate != null && !endDate.isBlank())
            existing.setEndDate(LocalDate.parse(endDate));

        // ✅ IMPORTANT: keep collection mutable and handle null (deleted all partners)
        existing.getPartners().clear();
        if (partners != null) {
            existing.getPartners().addAll(new ArrayList<>(partners));
        }

        existing.setStatus(status);

        new File(IMAGE_UPLOAD_DIR).mkdirs();
        new File(PDF_UPLOAD_DIR).mkdirs();

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            imageFile.transferTo(new File(IMAGE_UPLOAD_DIR + imageFileName));
            existing.setImageFilePath(imageFileName);
        }

        if (pdfFile != null && !pdfFile.isEmpty()) {
            String pdfFileName = UUID.randomUUID() + "_" + pdfFile.getOriginalFilename();
            pdfFile.transferTo(new File(PDF_UPLOAD_DIR + pdfFileName));
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> addProject(
            @RequestParam("title") String title,
            @RequestParam("budget") long budget,
            @RequestParam("description") String description,
            @RequestParam("quickSummary") String quickSummary,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "partners", required = false) List<String> partners,
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam(value = "pdf", required = false) MultipartFile pdfFile,
            @RequestParam(value = "status", required = false, defaultValue = "ON_GOING") String statusStr)
            throws IOException {

        new File(IMAGE_UPLOAD_DIR).mkdirs();
        new File(PDF_UPLOAD_DIR).mkdirs();

        String imageFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        imageFile.transferTo(new File(IMAGE_UPLOAD_DIR + imageFileName));

        String pdfFileName = null;
        if (pdfFile != null && !pdfFile.isEmpty()) {
            pdfFileName = UUID.randomUUID() + "_" + pdfFile.getOriginalFilename();
            pdfFile.transferTo(new File(PDF_UPLOAD_DIR + pdfFileName));
        }

        ProjectStatus status;
        try {
            status = ProjectStatus.valueOf(statusStr.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            status = ProjectStatus.ON_GOING;
        }

        Project project = new Project();
        project.setTitle(title);
        project.setBudget(budget);
        project.setDescription(description);
        project.setQuickSummary(quickSummary);
        if (startDate != null && !startDate.isBlank())
            project.setStartDate(LocalDate.parse(startDate));
        if (endDate != null && !endDate.isBlank())
            project.setEndDate(LocalDate.parse(endDate));

        // ✅ IMPORTANT: mutable list
        project.setPartners(partners != null ? new ArrayList<>(partners) : new ArrayList<>());

        project.setImageFilePath(imageFileName);
        project.setPdfFilePath(pdfFileName);
        project.setStatus(status);

        Project saved = projectService.save(project);
        return ResponseEntity.ok(ProjectMapper.toDTO(saved));
    }
}
