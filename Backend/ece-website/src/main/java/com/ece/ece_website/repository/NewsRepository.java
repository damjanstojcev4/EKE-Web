package com.ece.ece_website.repository;

import com.ece.ece_website.entity.News;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    String PUBLIC_VISIBILITY = "(n.published = true and n.publishedAt <= :now)";

    List<News> findAllByOrderByCreatedAtDesc();

    List<News> findTop3ByPublishedTrueAndPublishedAtLessThanEqualOrderByPublishedAtDescIdDesc(Instant now);

    @Query("select n from News n where " + PUBLIC_VISIBILITY + " order by n.publishedAt desc, n.id desc")
    List<News> findPublicNews(Instant now);

    @Query("select n from News n where n.id = :id and " + PUBLIC_VISIBILITY)
    Optional<News> findPublicNewsById(Long id, Instant now);

    @Query("select count(n) > 0 from News n where (n.imageFilePath = :filename or n.heroFilePath = :filename) and " + PUBLIC_VISIBILITY)
    boolean hasPublicImage(String filename, Instant now);

    boolean existsByImageFilePathOrHeroFilePath(String filename, String heroFilename);
    Optional<News> findBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Long id);
    @Query("select n from News n where " + PUBLIC_VISIBILITY + " and (:category is null or n.category = :category)")
    org.springframework.data.domain.Page<News> publicPage(Instant now, News.Category category, org.springframework.data.domain.Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select n from News n where n.id = :id")
    Optional<News> findByIdForUpdate(Long id);
}
