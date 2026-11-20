package com.ece.ece_website.service;

import com.ece.ece_website.entity.News;
import com.ece.ece_website.entity.Role;
import com.ece.ece_website.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;

    public List<News> findAll(boolean admin) {
        return admin ? newsRepository.findAllByOrderByCreatedAtDesc() : newsRepository.findPublicNews(Instant.now());
    }

    public Optional<News> findById(Long id, boolean admin) {
        return admin ? newsRepository.findById(id) : newsRepository.findPublicNewsById(id, Instant.now());
    }

    public List<News> findHomepageNews() {
        return newsRepository.findTop3ByPublishedTrueAndPublishedAtLessThanEqualOrderByPublishedAtDescIdDesc(Instant.now());
    }

    public boolean canReadImage(String filename, Authentication authentication) {
        return isAdmin(authentication)
                ? newsRepository.existsByImageFilePathOrHeroFilePath(filename, filename)
                : newsRepository.hasPublicImage(filename, Instant.now());
    }

    public static boolean isAdmin(Authentication authentication) {
        return authentication != null && authentication.isAuthenticated() && authentication.getAuthorities().stream()
                .anyMatch(authority -> Role.ADMIN.name().equals(authority.getAuthority()));
    }

    public Optional<News> findByIdForUpdate(Long id) {
        return newsRepository.findByIdForUpdate(id);
    }

    public News save(News news) {
        return newsRepository.save(news);
    }

    public void deleteById(Long id) {
        newsRepository.deleteById(id);
    }
}
