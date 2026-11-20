package com.ece.ece_website.controller;

import com.ece.ece_website.dto.NewsMapper;
import com.ece.ece_website.dto.NewsResponseDTO;
import com.ece.ece_website.dto.NewsWriteRequest;
import com.ece.ece_website.entity.News;
import com.ece.ece_website.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewsController {

    private static final Path NEWS_UPLOAD_DIR = Path.of(System.getProperty("user.dir"), "uploads", "news");
    private final NewsService newsService;

    @GetMapping
    public ResponseEntity<List<NewsResponseDTO>> getAllNews(Authentication authentication) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .body(newsService.findAll(NewsService.isAdmin(authentication)).stream().map(NewsMapper::toDTO).toList());
    }

    @GetMapping("/homepage")
    public ResponseEntity<List<NewsResponseDTO>> getHomepageNews() {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .body(newsService.findHomepageNews().stream().map(NewsMapper::toDTO).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> getNewsById(@PathVariable Long id, Authentication authentication) {
        return newsService.findById(id, NewsService.isAdmin(authentication))
                .map(news -> ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(NewsMapper.toDTO(news)))
                .orElseGet(() -> ResponseEntity.notFound().cacheControl(CacheControl.noStore()).build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NewsResponseDTO> createNews(
            @ModelAttribute NewsWriteRequest request,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {
        News news = new News();
        news.setPublished(false);
        return save(news, request, imageFile);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional(rollbackFor = IOException.class)
    public ResponseEntity<NewsResponseDTO> updateNews(
            @PathVariable Long id,
            @ModelAttribute NewsWriteRequest request,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {
        News existing = newsService.findByIdForUpdate(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News not found"));
        return save(existing, request, imageFile);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<NewsResponseDTO> save(News news, NewsWriteRequest request, MultipartFile image) throws IOException {
        if (request.shortDescription() != null) news.setShortDescription(request.shortDescription());
        if (request.instagramUrl() != null) news.setInstagramUrl(request.instagramUrl());
        if (request.title() != null) news.setTitle(request.title().strip());
        if (request.category() != null) news.setCategory(request.category());
        if (request.imageAlt() != null) news.setImageAlt(request.imageAlt().strip());
        if (request.publishedAt() != null) news.setPublishedAt(request.publishedAt());
        if (request.published() != null) {
            news.setPublished(request.published());
        } else if (news.getPublished() == null && request.usesPublishing()) {
            news.setPublished(false);
        }

        boolean hasNewImage = image != null && !image.isEmpty();
        validate(news, hasNewImage);
        if (hasNewImage) {
            String originalName = Objects.toString(image.getOriginalFilename(), "image");
            String lowerName = originalName.toLowerCase(java.util.Locale.ROOT);
            if (image.getSize() > 5 * 1024 * 1024 ||
                    !java.util.Set.of("image/png", "image/jpeg", "image/webp", "image/gif").contains(Objects.toString(image.getContentType(), "")) ||
                    !lowerName.matches(".*\\.(png|jpe?g|webp|gif)$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a PNG, JPG, WebP or GIF image of at most 5 MB");
            }
            Files.createDirectories(NEWS_UPLOAD_DIR);
            String filename = UUID.randomUUID() + "_" + originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
            image.transferTo(NEWS_UPLOAD_DIR.resolve(filename));
            news.setImageFilePath(filename);
        }
        return ResponseEntity.ok(NewsMapper.toDTO(newsService.save(news)));
    }

    private void validate(News news, boolean hasNewImage) {
        checkLength(news.getShortDescription(), 1200, "shortDescription");
        checkLength(news.getInstagramUrl(), 2000, "instagramUrl");
        checkLength(news.getTitle(), 255, "title");
        checkLength(news.getImageAlt(), 255, "imageAlt");
        if (news.getShortDescription() == null || news.getInstagramUrl() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "shortDescription and instagramUrl are required");
        }
        if (!Boolean.TRUE.equals(news.getPublished())) {
            return;
        }
        if (blank(news.getTitle()) || blank(news.getShortDescription())
                || news.getCategory() == null || news.getPublishedAt() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Publishing requires title, shortDescription, category and publishedAt");
        }
        if ((hasNewImage || news.getImageFilePath() != null) && blank(news.getImageAlt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Publishing a news image requires imageAlt");
        }
    }

    private void checkLength(String value, int maxLength, String field) {
        if (value != null && value.length() > maxLength) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " exceeds " + maxLength + " characters");
        }
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<java.util.Map<String, String>> validationError(ResponseStatusException exception) {
        return ResponseEntity.status(exception.getStatusCode())
                .body(java.util.Map.of("message", Objects.toString(exception.getReason(), "Invalid News request")));
    }
}
