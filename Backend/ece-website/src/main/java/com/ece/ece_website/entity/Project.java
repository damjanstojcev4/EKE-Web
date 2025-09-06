package com.ece.ece_website.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Data
public class Project {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

     @Column(nullable = false, unique = true, updatable = false)
     private UUID uuid = UUID.randomUUID();

    private String title;
    private long budget;
    @Column(length = 4000)
    private String description;
    private String imageFilePath;
    private String quickSummary;
    private String durationDate;
    @ElementCollection
    private List<String> partners = new ArrayList<>();
    private LocalDateTime date;
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;
    private String pdfFilePath;

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }

        if (date == null) {
            date = LocalDateTime.now();
        }

        if (status == null) {
            status = ProjectStatus.ON_GOING; // default setting for creating project
        }
    }
}
