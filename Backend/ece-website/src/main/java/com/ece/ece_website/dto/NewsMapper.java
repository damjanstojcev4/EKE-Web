package com.ece.ece_website.dto;

import com.ece.ece_website.entity.News;

public class NewsMapper {

    public static NewsResponseDTO toDTO(News news) {
        String imageUrl = news.getImageFilePath() != null
                ? "/api/uploads/news/" + news.getImageFilePath()
                : null;

        return new NewsResponseDTO(
                news.getId(),
                news.getShortDescription(),
                news.getInstagramUrl(),
                imageUrl,
                news.getCreatedAt());
    }
}
