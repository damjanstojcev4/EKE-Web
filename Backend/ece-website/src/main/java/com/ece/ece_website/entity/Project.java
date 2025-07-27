package com.ece.ece_website.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;

import java.time.LocalDate;

//@Entity
@Data
public class Project {
    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    private long budget;
    private String description;
    // pictures
    private String quickSummary;
    private LocalDate date; // when was, when is, date added?

//    TODO: projectDuration, partners, members from other countries(nullable), startTime, place, coverImage
//    TODO: activities, tags(nullable), contactOfResponsiblePerson
}
