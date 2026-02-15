package com.ece.ece_website.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NewsResponseDTO {
    private Long id;
    private String shortDescription;
    private String instagramUrl;
    private String imageUrl;
    private LocalDateTime createdAt;
}
