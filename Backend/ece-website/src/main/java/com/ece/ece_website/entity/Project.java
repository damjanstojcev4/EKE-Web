package com.ece.ece_website.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
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
    private String description;
    // pictures
    private String quickSummary;
    private LocalDate date; // when was, when is, date added?

//    TODO: projectDuration, partners, members from other countries(nullable), startTime, place, coverImage
//    TODO: activities, tags(nullable), contactOfResponsiblePerson

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }
}
