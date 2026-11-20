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
    private final com.ece.ece_website.repository.NewsRepository repository;
    private final com.ece.ece_website.service.ContentValidation contentValidation;

    @GetMapping("/public")
    public Object publicNews(@RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="12") int size,
                             @RequestParam(required=false) News.Category category) {
        if (page < 0 || size < 1 || size > 100) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pagination");
        return repository.publicPage(java.time.Instant.now(), category, org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Order.desc("publishedAt"), org.springframework.data.domain.Sort.Order.desc("id")))).map(NewsMapper::toDTO);
    }
    @GetMapping("/slug/{slug}")
    public ResponseEntity<NewsResponseDTO> bySlug(@PathVariable String slug) {
        News n = repository.findBySlug(slug).filter(item -> Boolean.TRUE.equals(item.getPublished()) && item.getPublishedAt() != null && !item.getPublishedAt().isAfter(java.time.Instant.now()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article unavailable"));
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(NewsMapper.toDTO(n));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<NewsResponseDTO> publicById(@PathVariable Long id) {
        return newsService.findById(id, false)
                .map(n -> ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(NewsMapper.toDTO(n)))
                .orElseGet(() -> ResponseEntity.notFound().cacheControl(CacheControl.noStore()).build());
    }

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
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "hero", required = false) MultipartFile heroFile) throws IOException {
        News news = new News();
        news.setPublished(false);
        return save(news, request, imageFile, heroFile);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional(rollbackFor = IOException.class)
    public ResponseEntity<NewsResponseDTO> updateNews(
            @PathVariable Long id,
            @ModelAttribute NewsWriteRequest request,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "hero", required = false) MultipartFile heroFile) throws IOException {
        News existing = newsService.findByIdForUpdate(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News not found"));
        return save(existing, request, imageFile, heroFile);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<NewsResponseDTO> save(News news, NewsWriteRequest request, MultipartFile image, MultipartFile hero) throws IOException {
        if (request.slug() != null) news.setSlug(contentValidation.slug(request.slug()));
        if (news.getSlug() == null) news.setSlug("news-" + UUID.randomUUID());
        if (repository.existsBySlugAndIdNot(news.getSlug(), news.getId() == null ? -1L : news.getId())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug already exists");
        if (request.contentJson() != null) news.setContentJson(contentValidation.blocks(request.contentJson()));
        if (request.emphasis() != null) news.setEmphasis(contentValidation.text(request.emphasis(), 1200));
        if (request.introduction() != null) news.setIntroduction(contentValidation.text(request.introduction(), 4000));
        if (request.heroAlt() != null) news.setHeroAlt(contentValidation.text(request.heroAlt(), 255));
        if (request.relatedIds() != null) {
            if (!request.relatedIds().matches("([0-9]+(,[0-9]+)*)?")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Related IDs must be comma-separated article IDs");
            news.setRelatedIds(contentValidation.text(request.relatedIds(), 2000));
        }
        if(request.placement()!=null) {
            if(!java.util.Set.of("LATEST","FEATURED","BIG_STORY","COMMUNITY","MEDIA").contains(request.placement())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid placement");
            news.setPlacement(request.placement());
        }
        if(request.mediaKind()!=null) {
            if(!java.util.Set.of("","AUDIO","VIDEO").contains(request.mediaKind())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid media kind");
            news.setMediaKind(request.mediaKind());
        }
        if(request.mediaUrl()!=null) news.setMediaUrl(contentValidation.url(request.mediaUrl()));
        news.setUpdatedAt(java.time.Instant.now());
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
        if (Boolean.TRUE.equals(news.getPublished()) && ((hero != null && !hero.isEmpty()) || news.getHeroFilePath() != null) && blank(news.getHeroAlt())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hero image requires alternative text");
        if (hero != null && !hero.isEmpty()) news.setHeroFilePath(contentValidation.upload(hero, NEWS_UPLOAD_DIR, false));
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
