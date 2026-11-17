package com.ece.ece_website.dto;

import com.ece.ece_website.entity.News.Category;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NewsResponseDTO {
    private Long id;
    private String shortDescription;
    private String instagramUrl;
    private String imageUrl;
    private LocalDateTime createdAt;
    private String title;
    private Category category;
    private String imageAlt;
    private Instant publishedAt;
    private Boolean published;
}
