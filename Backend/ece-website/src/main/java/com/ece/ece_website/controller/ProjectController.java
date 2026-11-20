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

    @Autowired private com.ece.ece_website.service.ContentValidation validation;
    @PostMapping(value="/media", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public java.util.Map<String,String> uploadSupportingMedia(@RequestParam("file") MultipartFile file) throws IOException {
        boolean pdf="application/pdf".equals(file.getContentType());
        String filename=validation.upload(file,java.nio.file.Path.of(pdf?PDF_UPLOAD_DIR:IMAGE_UPLOAD_DIR),pdf);
        return java.util.Map.of("url","/api/uploads/"+(pdf?"pdf/":"images/")+filename);
    }
    @GetMapping("/public")
    public List<ProjectResponseDTO> publicProjects(@RequestParam(required=false) ProjectStatus status) {
        return projectService.findAll().stream().filter(p -> status == null || status == p.getStatus())
            .sorted(java.util.Comparator.comparing(Project::getId).reversed()).map(ProjectMapper::toDTO).toList();
    }
    @GetMapping("/slug/{slug}")
    public ProjectResponseDTO bySlug(@PathVariable String slug) {
        return projectService.findAll().stream().filter(p -> slug.equals(p.getSlug())).findFirst().map(ProjectMapper::toDTO)
            .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND,"Project unavailable"));
    }
    private void details(Project project, com.ece.ece_website.dto.ProjectDetailsRequest r) {
        if (r.slug()!=null && !r.slug().isBlank()) project.setSlug(validation.slug(r.slug()));
        if (project.getSlug()==null) project.setSlug("project-"+project.getUuid());
        if (projectService.findAll().stream().anyMatch(p -> p.getId()!=project.getId() && project.getSlug().equals(p.getSlug()))) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT,"Slug already exists");
        if(r.resourcesJson()!=null) project.setResourcesJson(validation.mediaReferences(r.resourcesJson(),false));
        if(r.partnerMediaJson()!=null) project.setPartnerMediaJson(validation.mediaReferences(r.partnerMediaJson(),true));
        if (r.programme()!=null) project.setProgramme(validation.text(r.programme(),255));
        if (r.grantValue()!=null) { if(r.grantValue().signum()<0) validation.fail("Grant cannot be negative"); project.setGrantValue(r.grantValue()); }
        if (r.currency()!=null) { if(!r.currency().isBlank() && !r.currency().matches("[A-Z]{3}")) validation.fail("Currency must be a three-letter code"); project.setCurrency(r.currency()); }
        if (r.countries()!=null) project.setCountries(validation.text(r.countries(),2000));
        if (r.keyAction()!=null) project.setKeyAction(validation.text(r.keyAction(),255));
        if (r.actionType()!=null) project.setActionType(validation.text(r.actionType(),255));
        if (r.website()!=null) project.setWebsite(validation.url(r.website()));
        if (r.topics()!=null) project.setTopics(validation.text(r.topics(),2000));
        if (r.contentJson()!=null) project.setContentJson(validation.blocks(r.contentJson()));
        if (r.imageAlt()!=null) project.setImageAlt(validation.text(r.imageAlt(),255));
        if (r.downloadDescription()!=null) project.setDownloadDescription(validation.text(r.downloadDescription(),4000));
        if (project.getTitle()==null || project.getTitle().isBlank() || project.getTitle().length()>255 || project.getBudget()<0) validation.fail("Valid title and nonnegative budget required");
        validation.text(project.getQuickSummary(),4000);
        if(project.getStartDate()!=null && project.getEndDate()!=null && project.getEndDate().isBefore(project.getStartDate())) validation.fail("End date precedes start date");
    }
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

    @org.springframework.transaction.annotation.Transactional(rollbackFor = IOException.class)
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
            @RequestParam(value = "pdf", required = false) MultipartFile pdfFile,
            @RequestParam(value = "logo", required = false) MultipartFile logo,
            @ModelAttribute com.ece.ece_website.dto.ProjectDetailsRequest detail) throws IOException {

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
            String imageFileName = validation.upload(imageFile, java.nio.file.Path.of(IMAGE_UPLOAD_DIR), false);
            existing.setImageFilePath(imageFileName);
        }

        if (pdfFile != null && !pdfFile.isEmpty()) {
            String pdfFileName = validation.upload(pdfFile, java.nio.file.Path.of(PDF_UPLOAD_DIR), true);
            existing.setPdfFilePath(pdfFileName);
        }

        details(existing, detail);
        if(logo!=null && !logo.isEmpty()) existing.setLogoFilePath(validation.upload(logo, java.nio.file.Path.of(IMAGE_UPLOAD_DIR), false));
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
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "logo", required = false) MultipartFile logo,
            @ModelAttribute com.ece.ece_website.dto.ProjectDetailsRequest detail,
            @RequestParam(value = "pdf", required = false) MultipartFile pdfFile,
            @RequestParam(value = "status", required = false, defaultValue = "ON_GOING") String statusStr)
            throws IOException {

        new File(IMAGE_UPLOAD_DIR).mkdirs();
        new File(PDF_UPLOAD_DIR).mkdirs();

        String imageFileName = imageFile == null || imageFile.isEmpty() ? null : validation.upload(imageFile, java.nio.file.Path.of(IMAGE_UPLOAD_DIR), false);

        String pdfFileName = null;
        if (pdfFile != null && !pdfFile.isEmpty()) {
            pdfFileName = validation.upload(pdfFile, java.nio.file.Path.of(PDF_UPLOAD_DIR), true);
        }

        ProjectStatus status;
        try {
            status = ProjectStatus.valueOf(statusStr.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,"Invalid project status");
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

        details(project, detail);
        if(logo!=null && !logo.isEmpty()) project.setLogoFilePath(validation.upload(logo, java.nio.file.Path.of(IMAGE_UPLOAD_DIR), false));
        Project saved = projectService.save(project);
        return ResponseEntity.ok(ProjectMapper.toDTO(saved));
    }
}
