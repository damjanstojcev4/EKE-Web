package com.ece.ece_website.controller;

import com.ece.ece_website.dto.ProjectMapper;
import com.ece.ece_website.dto.ProjectRequestDTO;
import com.ece.ece_website.dto.ProjectResponseDTO;
import com.ece.ece_website.entity.Project;
import com.ece.ece_website.service.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
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

    @GetMapping("{uuid}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable String uuid) {
        Project project = projectService.findByName(uuid); // throw 404 if not found

        byte[] image = project.getImage();
        if (image == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG); // change to jpeg

        return new ResponseEntity<>(image, headers, HttpStatus.OK);
    }

    @PostMapping(value = "/projects", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> addProject(
            @RequestPart("project") String projectJson,
            @RequestPart("image") MultipartFile imageFile) {

        try {
            // Convert JSON string to DTO
            ObjectMapper mapper = new ObjectMapper();
            ProjectRequestDTO dto = mapper.readValue(projectJson, ProjectRequestDTO.class);

            // Convert DTO to Entity
            Project project = ProjectMapper.fromDTO(dto);

            // Store image as byte array
            project.setImage(imageFile.getBytes());

            Project saved = projectService.save(project);
            ProjectResponseDTO response = ProjectMapper.toDTO(saved);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ProjectResponseDTO> updateProject(@PathVariable UUID uuid,
                                                            @RequestBody ProjectRequestDTO project) {
        ProjectResponseDTO updatedProject = projectService.updateProject(uuid, project);

        return new ResponseEntity<>(updatedProject, HttpStatus.OK);
    }

    @DeleteMapping("{uuid}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID uuid) {
        projectService.deleteProject(uuid);

        return ResponseEntity.noContent().build();
    }
}
