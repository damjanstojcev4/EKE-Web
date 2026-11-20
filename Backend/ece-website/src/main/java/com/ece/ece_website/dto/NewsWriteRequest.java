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
        Boolean published, String slug, String emphasis, String introduction, String contentJson, String heroAlt, String relatedIds, String placement, String mediaKind, String mediaUrl
) {
    public boolean usesPublishing() {
        return title != null || category != null || imageAlt != null || publishedAt != null || published != null;
    }
}
