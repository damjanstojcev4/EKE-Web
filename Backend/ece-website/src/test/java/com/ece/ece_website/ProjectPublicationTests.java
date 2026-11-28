package com.ece.ece_website;

import com.ece.ece_website.repository.ProjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties={"spring.datasource.url=jdbc:h2:mem:project_publication;DB_CLOSE_DELAY=-1", "spring.jpa.hibernate.ddl-auto=create-drop"})
@AutoConfigureMockMvc
class ProjectPublicationTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired ProjectRepository projects;

    @Test void draftPublishEditUnpublishAndDeleteUseTheSamePublicIdentifier() throws Exception {
        var created = mvc.perform(multipart("/projects").with(user("editor").authorities(() -> "ADMIN"))
            .param("title", "CMS project").param("slug", "cms-project").param("budget", "0")
            .param("description", "Persisted details").param("quickSummary", "Persisted summary")
            .param("published", "false"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.published").value(false))
            .andReturn().getResponse().getContentAsString();
        String uuid = json.readTree(created).path("uuid").asText();
        for (String path : new String[]{"/projects/slug/cms-project", "/projects/get/"+uuid, "/projects/CMS project"})
            mvc.perform(get(path)).andExpect(status().isNotFound());
        for (String path : new String[]{"/projects/public", "/projects/", "/projects/recent"})
            mvc.perform(get(path)).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(0));
        mvc.perform(get("/projects/").with(user("editor").authorities(() -> "ADMIN")))
            .andExpect(jsonPath("$.length()").value(1));
        for (boolean published : new boolean[]{true, false}) {
            mvc.perform(multipart(HttpMethod.PUT, "/projects/"+uuid).with(user("editor").authorities(() -> "ADMIN"))
                .param("title", "Updated CMS project").param("description", "Updated persisted content")
                .param("quickSummary", "Updated summary").param("budget", "0").param("status", "ON_GOING")
                .param("published", String.valueOf(published)))
                .andExpect(status().isOk());
            if (published) {
                mvc.perform(get("/projects/slug/cms-project")).andExpect(status().isOk())
                    .andExpect(jsonPath("$.description").value("Updated persisted content"))
                    .andExpect(jsonPath("$.image").isEmpty()).andExpect(jsonPath("$.partners").isArray())
                    .andExpect(jsonPath("$.id").doesNotExist()).andExpect(jsonPath("$.imageFilePath").doesNotExist());
            } else mvc.perform(get("/projects/slug/cms-project")).andExpect(status().isNotFound());
        }
        mvc.perform(delete("/projects/"+uuid).with(user("editor").authorities(() -> "ADMIN"))).andExpect(status().isNoContent());
        mvc.perform(get("/projects/slug/cms-project")).andExpect(status().isNotFound());
        mvc.perform(get("/projects/slug/invalid_identifier")).andExpect(status().isNotFound());
        assertThat(projects.findByUuid(java.util.UUID.fromString(uuid))).isEmpty();
    }

    @Test void publicationMigrationPreservesExistingRowsAndIsRepeatable() throws Exception {
        try (var connection = java.sql.DriverManager.getConnection("jdbc:h2:mem:publication_migration", "sa", "");
             var statement = connection.createStatement()) {
            statement.execute("CREATE TABLE projects (id BIGINT PRIMARY KEY, title VARCHAR(255))");
            statement.execute("INSERT INTO projects VALUES (1, 'Existing project')");
            String migration = java.nio.file.Files.readString(java.nio.file.Path.of("../../deploy/staging/migrations/005-project-publication.sql"));
            statement.execute(migration);
            statement.execute(migration);
            try (var rows = statement.executeQuery("SELECT title, published FROM projects WHERE id=1")) {
                assertThat(rows.next()).isTrue();
                assertThat(rows.getString(1)).isEqualTo("Existing project");
                assertThat(rows.getBoolean(2)).isTrue();
            }
        }
    }
}
