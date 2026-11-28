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

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean published = true;

    private String title;
    private long budget;
    @Lob
    @Column(columnDefinition = "CLOB")
    private String description;
    private String imageFilePath;
    @Column(length = 4000)
    private String quickSummary;
    private LocalDate startDate;
    private LocalDate endDate;
    @ElementCollection
    private List<String> partners = new ArrayList<>();
    private LocalDateTime date;
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;
    private String pdfFilePath;

    @Column(unique = true, length = 160)
    private String slug;
    @Column(length = 255)
    private String programme;
    @Column(precision = 19, scale = 2)
    private java.math.BigDecimal grantValue;
    @Column(length = 3)
    private String currency;
    @Column(length = 2000)
    private String countries;
    @Column(length = 255)
    private String keyAction;
    @Column(length = 255)
    private String actionType;
    @Column(length = 2000)
    private String website;
    @Column(length = 2000)
    private String topics;
    @Lob
    private String contentJson;
    @Column(length = 255)
    private String logoFilePath;
    @Column(length = 255)
    private String imageAlt;
    @Column(length = 4000)
    private String downloadDescription;

    @Lob private String resourcesJson;
    @Lob private String partnerMediaJson;
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
