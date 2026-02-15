package com.ece.ece_website.controller;

import com.ece.ece_website.dto.NewsMapper;
import com.ece.ece_website.dto.NewsResponseDTO;
import com.ece.ece_website.entity.News;
import com.ece.ece_website.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/news")
public class NewsController {

    private static final String NEWS_UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/news/";

    @Autowired
    private NewsService newsService;

    @GetMapping
    public List<NewsResponseDTO> getAllNews() {
        return newsService.findAll()
                .stream()
                .map(NewsMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> getNewsById(@PathVariable Long id) {
        return newsService.findById(id)
                .map(news -> ResponseEntity.ok(NewsMapper.toDTO(news)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NewsResponseDTO> createNews(
            @RequestParam("shortDescription") String shortDescription,
            @RequestParam("instagramUrl") String instagramUrl,
            @RequestParam("image") MultipartFile imageFile) throws IOException {

        createUploadDir();

        String imageFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        imageFile.transferTo(new File(NEWS_UPLOAD_DIR + imageFileName));

        News news = new News();
        news.setShortDescription(shortDescription);
        news.setInstagramUrl(instagramUrl);
        news.setImageFilePath(imageFileName);

        News saved = newsService.save(news);
        return ResponseEntity.ok(NewsMapper.toDTO(saved));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NewsResponseDTO> updateNews(
            @PathVariable Long id,
            @RequestParam("shortDescription") String shortDescription,
            @RequestParam("instagramUrl") String instagramUrl,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        News existing = newsService.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));

        existing.setShortDescription(shortDescription);
        existing.setInstagramUrl(instagramUrl);

        if (imageFile != null && !imageFile.isEmpty()) {
            createUploadDir();
            // Optional: Delete old image?
            String imageFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            imageFile.transferTo(new File(NEWS_UPLOAD_DIR + imageFileName));
            existing.setImageFilePath(imageFileName);
        }

        News updated = newsService.save(existing);
        return ResponseEntity.ok(NewsMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        // Optional: Delete image from disk?
        newsService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void createUploadDir() {
        File dir = new File(NEWS_UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }
}
