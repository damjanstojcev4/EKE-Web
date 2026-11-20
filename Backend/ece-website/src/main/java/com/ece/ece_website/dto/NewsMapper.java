package com.ece.ece_website.dto;

import com.ece.ece_website.entity.News;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;

public class NewsMapper {

    public static NewsResponseDTO toDTO(News news) {
        String imageUrl = news.getImageFilePath() != null
                ? "/api/uploads/news/" + UriUtils.encodePathSegment(news.getImageFilePath(), StandardCharsets.UTF_8)
                : null;

        return new NewsResponseDTO(
                news.getId(),
                news.getShortDescription(),
                news.getInstagramUrl(),
                imageUrl,
                news.getCreatedAt(),
                news.getTitle(),
                news.getCategory(),
                news.getImageAlt(),
                news.getPublishedAt(),
                news.getPublished(), news.getSlug(), news.getEmphasis(), news.getIntroduction(), news.getContentJson(),
                news.getHeroFilePath() == null ? null : "/api/uploads/news/" + UriUtils.encodePathSegment(news.getHeroFilePath(), StandardCharsets.UTF_8),
                news.getHeroAlt(), news.getRelatedIds(), news.getUpdatedAt(), news.getPlacement(), news.getMediaKind(), news.getMediaUrl());
    }
}
