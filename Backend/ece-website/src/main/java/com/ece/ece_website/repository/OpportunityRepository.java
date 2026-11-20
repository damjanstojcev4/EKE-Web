package com.ece.ece_website.repository;
import com.ece.ece_website.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
public interface OpportunityRepository extends JpaRepository<Opportunity,Long> {
 java.util.Optional<Opportunity> findBySlugAndPublishedTrue(String slug);
 boolean existsBySlugAndIdNot(String slug,Long id);
 java.util.List<Opportunity> findByPublishedTrueOrderByApplicationDeadlineAscIdDesc();
}
