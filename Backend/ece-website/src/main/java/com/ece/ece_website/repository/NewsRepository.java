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
    String PUBLIC_VISIBILITY = "(n.published is null or (n.published = true and n.publishedAt <= :now))";

    List<News> findAllByOrderByCreatedAtDesc();

    List<News> findTop3ByPublishedTrueAndPublishedAtLessThanEqualOrderByPublishedAtDescIdDesc(Instant now);

    @Query("select n from News n where " + PUBLIC_VISIBILITY + " order by n.createdAt desc, n.id desc")
    List<News> findPublicNews(Instant now);

    @Query("select n from News n where n.id = :id and " + PUBLIC_VISIBILITY)
    Optional<News> findPublicNewsById(Long id, Instant now);

    @Query("select count(n) > 0 from News n where n.imageFilePath = :filename and " + PUBLIC_VISIBILITY)
    boolean hasPublicImage(String filename, Instant now);

    boolean existsByImageFilePath(String filename);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select n from News n where n.id = :id")
    Optional<News> findByIdForUpdate(Long id);
}
