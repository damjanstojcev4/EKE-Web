package com.ece.ece_website.dto;

import com.ece.ece_website.entity.News.Category;

import java.time.Instant;

public record NewsWriteRequest(
        String shortDescription,
        String instagramUrl,
        String title,
        Category category,
        String imageAlt,
        Instant publishedAt,
        Boolean published
) {
    public boolean usesPublishing() {
        return title != null || category != null || imageAlt != null || publishedAt != null || published != null;
    }
}
