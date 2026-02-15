package com.ece.ece_website.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "news")
@Data
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1200, nullable = false)
    private String shortDescription;

    @Column(length = 2000, nullable = false)
    private String instagramUrl;

    // stores filename only (like your Project)
    private String imageFilePath;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null)
            createdAt = LocalDateTime.now();
    }
}
