package com.ece.ece_website.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "news")
@Data
public class News {

    public enum Category { LATEST_NEWS, OPEN_CALL }

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

    @Column(length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(length = 16)
    private Category category;

    @Column(length = 255)
    private String imageAlt;

    private Instant publishedAt;

    // Null identifies a legacy record that has never used the publishing workflow.
    private Boolean published;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null)
            createdAt = LocalDateTime.now();
    }
}
