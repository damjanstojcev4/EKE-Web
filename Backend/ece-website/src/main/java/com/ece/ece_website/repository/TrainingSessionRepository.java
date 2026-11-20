package com.ece.ece_website.repository;
import com.ece.ece_website.entity.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TrainingSessionRepository extends JpaRepository<TrainingSession,Long> {
 java.util.Optional<TrainingSession> findBySlugAndPublishedTrue(String slug);
 boolean existsBySlugAndIdNot(String slug,Long id);
 java.util.List<TrainingSession> findByPublishedTrueOrderByRegistrationDeadlineAscIdDesc();
}
