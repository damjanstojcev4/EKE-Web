package com.ece.ece_website.repository;

import com.ece.ece_website.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAll(); // list all projects

    Optional<Project> findByTitle(String title); // search by name

    // Search for Admin
    Optional<Project> findByUuid(UUID uuid);

    // TODO: ADD MORE QUERIES IF NEEDED

}
