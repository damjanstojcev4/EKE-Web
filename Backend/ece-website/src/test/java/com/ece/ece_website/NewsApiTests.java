package com.ece.ece_website;

import com.ece.ece_website.entity.Admin;
import com.ece.ece_website.entity.News;
import com.ece.ece_website.entity.Role;
import com.ece.ece_website.repository.AdminRepository;
import com.ece.ece_website.repository.NewsRepository;
import com.ece.ece_website.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.LocalDateTime;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:news_api;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.h2.console.enabled=false",
        "spring.mail.password=local-test"
})
@AutoConfigureMockMvc
class NewsApiTests {

    private static final String PUBLISHED_AT = "2025-01-04T14:00:00Z";
    private static final String INSTAGRAM_URL = "https://www.instagram.com/p/example/";

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired NewsRepository newsRepository;
    @Autowired AdminRepository adminRepository;
    @Autowired JwtService jwtService;

    private String adminToken;
    private String userToken;

    @BeforeEach
    void prepareDatabase() {
        newsRepository.deleteAll();
        adminToken = jwtService.generateToken(account("news-test-admin", Role.ADMIN));
        userToken = jwtService.generateToken(account("news-test-user", Role.USER));
    }

    @Test
    void homepageFiltersOrdersAndLimitsWithOrWithoutAdminAuthentication() throws Exception {
        addNews("Fourth", true, "2025-01-01T14:00:00Z");
        addNews("Third", true, "2025-01-03T14:00:00Z");
        addNews("Second", true, PUBLISHED_AT);
        News first = addNews("First", true, PUBLISHED_AT);
        addNews("Draft", false, "2025-02-01T14:00:00Z");
        addNews("Scheduled", true, "2100-01-01T00:00:00Z");
        addNews(null, null, null);

        mvc.perform(get("/news/homepage").servletPath("/news/homepage"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].title", contains("First", "Second", "Third")))
                .andExpect(jsonPath("$[0].id").value(first.getId()))
                .andExpect(jsonPath("$[0].category").value("LATEST_NEWS"))
                .andExpect(jsonPath("$[0].shortDescription").value("Summary"))
                .andExpect(jsonPath("$[0].imageAlt").value(nullValue()))
                .andExpect(jsonPath("$[0].imageUrl").value(nullValue()))
                .andExpect(jsonPath("$[0].instagramUrl").value(INSTAGRAM_URL))
                .andExpect(jsonPath("$[0].createdAt").isNotEmpty())
                .andExpect(jsonPath("$[0].publishedAt").value(PUBLISHED_AT))
                .andExpect(jsonPath("$[0].published").value(true))
                .andExpect(jsonPath("$[0].imageFilePath").doesNotExist());

        mvc.perform(get("/news/homepage").servletPath("/news/homepage").cookie(adminCookie()).with(csrf()))
                .andExpect(jsonPath("$[*].title", contains("First", "Second", "Third")));
        mvc.perform(get("/news").servletPath("/news"))
                .andExpect(jsonPath("$[*].title", contains("First", "Second", "Third", "Fourth")));
    }

    @Test
    void publicReadsHideLegacyDraftAndScheduledRowsWhileAdminsCanEditAll() throws Exception {
        News legacy = addNews(null, null, null);
        News draft = addNews("Draft", false, PUBLISHED_AT);
        long scheduled = addNews("Scheduled", true, "2100-01-01T00:00:00Z").getId();

        mvc.perform(get("/news").servletPath("/news"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(0)));
        mvc.perform(get("/news/{id}", legacy.getId()).servletPath("/news/" + legacy.getId()))
                .andExpect(status().isNotFound());
        for (long hiddenId : new long[]{draft.getId(), scheduled}) {
            mvc.perform(get("/news/{id}", hiddenId).servletPath("/news/" + hiddenId))
                    .andExpect(status().isNotFound());
        }
        mvc.perform(get("/news").servletPath("/news").header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(0)));
        mvc.perform(get("/news").servletPath("/news").header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CACHE_CONTROL, "no-store"))
                .andExpect(jsonPath("$.length()", is(3)));
        mvc.perform(get("/news/{id}", draft.getId()).servletPath("/news/" + draft.getId()).cookie(adminCookie()).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Draft"));
        mvc.perform(get("/news/homepage").servletPath("/news/homepage"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void existingMultipartClientsCanCreateEditAndDeleteLegacyRecords() throws Exception {
        String imageUrl = null;
        try {
            String created = mvc.perform(multipart("/news")
                            .file(photo())
                            .servletPath("/news").cookie(adminCookie()).with(csrf())
                            .param("shortDescription", "Legacy description").param("instagramUrl", INSTAGRAM_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.published").value(false))
                    .andReturn().getResponse().getContentAsString();
            long id = json.readTree(created).get("id").asLong();
            imageUrl = json.readTree(created).get("imageUrl").asText();

            mvc.perform(multipart(HttpMethod.PUT, "/news/{id}", id).servletPath("/news/" + id).cookie(adminCookie()).with(csrf())
                            .param("shortDescription", "Edited legacy description").param("instagramUrl", INSTAGRAM_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.shortDescription").value("Edited legacy description"))
                    .andExpect(jsonPath("$.imageUrl").value(imageUrl))
                    .andExpect(jsonPath("$.published").value(false));
            mvc.perform(get(assetPath(imageUrl)).servletPath(assetPath(imageUrl))).andExpect(status().isNotFound());
            mvc.perform(delete("/news/{id}", id).servletPath("/news/" + id).cookie(adminCookie()).with(csrf()))
                    .andExpect(status().isNoContent());
            mvc.perform(get("/news/{id}", id).servletPath("/news/" + id)).andExpect(status().isNotFound());
        } finally {
            removeTestImage(imageUrl);
        }
    }

    @Test
    void adminCanPublishAndUnpublishWithOptionalImagesAndDraftUploadsStayPrivate() throws Exception {
        String imageUrl = null;
        try {
            String created = mvc.perform(multipart("/news").file(photo())
                            .servletPath("/news").cookie(adminCookie()).with(csrf())
                            .param("shortDescription", "Application details").param("instagramUrl", INSTAGRAM_URL)
                            .param("title", "  Volunteer opportunity  ").param("category", "OPEN_CALL"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.title").value("Volunteer opportunity"))
                    .andExpect(jsonPath("$.published").value(false))
                    .andReturn().getResponse().getContentAsString();
            long id = json.readTree(created).get("id").asLong();
            imageUrl = json.readTree(created).get("imageUrl").asText();
            String asset = assetPath(imageUrl);

            mvc.perform(get(asset).servletPath(asset)).andExpect(status().isNotFound());
            mvc.perform(head(asset).servletPath(asset)).andExpect(status().isNotFound());
            mvc.perform(get(asset).servletPath(asset).cookie(adminCookie()).with(csrf())).andExpect(status().isOk());
            mvc.perform(edit(id).param("publishedAt", PUBLISHED_AT).param("published", "true"))
                    .andExpect(status().isBadRequest());
            mvc.perform(edit(id).param("imageAlt", "Volunteers working together")
                            .param("publishedAt", PUBLISHED_AT).param("published", "true"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.publishedAt").value(PUBLISHED_AT))
                    .andExpect(jsonPath("$.category").value("OPEN_CALL"))
                    .andExpect(jsonPath("$.imageUrl").value(imageUrl));
            mvc.perform(get("/news/homepage").servletPath("/news/homepage"))
                    .andExpect(jsonPath("$[0].imageAlt").value("Volunteers working together"))
                    .andExpect(jsonPath("$[0].imageUrl").value(imageUrl));
            mvc.perform(get(asset).servletPath(asset)).andExpect(status().isOk());
            mvc.perform(edit(id).param("published", "false")).andExpect(status().isOk());
            mvc.perform(get(asset).servletPath(asset)).andExpect(status().isNotFound());
            mvc.perform(get("/news/homepage").servletPath("/news/homepage")).andExpect(content().json("[]"));
        } finally {
            removeTestImage(imageUrl);
        }
    }

    @Test
    void publicationValidationAndWriteAuthorizationAreEnforced() throws Exception {
        mvc.perform(multipart("/news").servletPath("/news")).andExpect(status().isUnauthorized());
        mvc.perform(multipart("/news").servletPath("/news").header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken))
                .andExpect(status().isForbidden());
        mvc.perform(post("/auth/register").servletPath("/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"untrusted\",\"password\":\"example\"}"))
                .andExpect(status().isUnauthorized());
        mvc.perform(multipart("/news").servletPath("/news").cookie(adminCookie()).with(csrf())
                        .param("shortDescription", "Summary").param("instagramUrl", INSTAGRAM_URL)
                        .param("published", "true"))
                .andExpect(status().isBadRequest());
        mvc.perform(multipart("/news").servletPath("/news").cookie(adminCookie()).with(csrf())
                        .param("shortDescription", "Summary").param("instagramUrl", INSTAGRAM_URL)
                        .param("category", "INVALID"))
                .andExpect(status().isBadRequest());
        mvc.perform(multipart("/news").servletPath("/news").cookie(adminCookie()).with(csrf())
                        .param("shortDescription", "Summary").param("instagramUrl", INSTAGRAM_URL)
                        .param("title", "Without an image").param("category", "LATEST_NEWS")
                        .param("published", "true").param("publishedAt", PUBLISHED_AT))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imageUrl").value(nullValue()));
    }

    @Test
    void draftScheduleReschedulePublishEditAndUnpublishPreserveLegacyRows() throws Exception {
        News untouched = addNews(null, null, null);
        News legacy = addNews(null, null, null);
        String created = mvc.perform(multipart("/news").servletPath("/news").cookie(adminCookie()).with(csrf())
                        .param("title", "New draft").param("category", "LATEST_NEWS")
                        .param("shortDescription", "Summary").param("instagramUrl", "").param("published", "false"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.published").value(false))
                .andReturn().getResponse().getContentAsString();
        long id = json.readTree(created).get("id").asLong();
        mvc.perform(edit(id).param("published", "true").param("publishedAt", "2100-01-01T01:00:00+01:00"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.publishedAt").value("2100-01-01T00:00:00Z"));
        mvc.perform(edit(id).param("publishedAt", "2100-02-01T00:00:00Z"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.publishedAt").value("2100-02-01T00:00:00Z"));
        mvc.perform(get("/news/homepage").servletPath("/news/homepage")).andExpect(content().json("[]"));
        // Explicit immediate publication: the editor supplies a UTC instant at or before now.
        String now = Instant.now().minusSeconds(1).toString();
        mvc.perform(edit(id).param("publishedAt", now)).andExpect(status().isOk());
        mvc.perform(edit(id).param("shortDescription", "Edited live summary"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.published").value(true));
        mvc.perform(get("/news/homepage").servletPath("/news/homepage"))
                .andExpect(jsonPath("$[0].shortDescription").value("Edited live summary"));
        mvc.perform(edit(id).param("published", "false")).andExpect(status().isOk());
        mvc.perform(get("/news/homepage").servletPath("/news/homepage")).andExpect(content().json("[]"));
        mvc.perform(edit(legacy.getId()).param("title", "Prepared legacy").param("category", "OPEN_CALL")
                        .param("published", "false"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.instagramUrl").value(INSTAGRAM_URL));
        mvc.perform(edit(legacy.getId()).param("published", "true").param("publishedAt", now))
                .andExpect(status().isOk());
        assertThat(newsRepository.count()).isEqualTo(3);
        News unchanged = newsRepository.findById(untouched.getId()).orElseThrow();
        assertThat(unchanged.getPublished()).isNull();
        assertThat(unchanged.getPublishedAt()).isNull();
        assertThat(unchanged.getShortDescription()).isEqualTo("Summary");
        assertThat(unchanged.getCreatedAt()).isEqualTo(untouched.getCreatedAt());
    }

    @Test
    void visibilityIncludesExactBoundaryAndExcludesMissingTimestamps() {
        Instant boundary = Instant.parse(PUBLISHED_AT);
        News eligible = addNews("Exactly now", true, PUBLISHED_AT);
        addNews("One microsecond later", true, boundary.plusNanos(1000).toString());
        addNews("No timestamp", true, null);
        addNews(null, null, null);
        assertThat(newsRepository.findTop3ByPublishedTrueAndPublishedAtLessThanEqualOrderByPublishedAtDescIdDesc(boundary))
                .extracting(News::getId).containsExactly(eligible.getId());
        assertThat(newsRepository.findPublicNews(boundary)).extracting(News::getId).containsExactly(eligible.getId());
    }

    @Test
    void rejectedUpdatesDoNotPersistAndAllWriteMethodsRequireAdmin() throws Exception {
        News legacy = addNews(null, null, null);
        mvc.perform(edit(legacy.getId()).param("title", "Should roll back").param("published", "true"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.message").isNotEmpty());
        assertThat(newsRepository.findById(legacy.getId()).orElseThrow().getTitle()).isNull();
        mvc.perform(edit(legacy.getId()).param("publishedAt", "not-a-date")).andExpect(status().isBadRequest());
        mvc.perform(edit(legacy.getId()).param("publishedAt", "2026-11-20T12:00:00")).andExpect(status().isBadRequest());
        mvc.perform(edit(legacy.getId()).param("title", "x".repeat(256))).andExpect(status().isBadRequest());
        mvc.perform(multipart("/news").file(new MockMultipartFile("image", "unsafe.html", "text/html", new byte[]{1}))
                        .servletPath("/news").cookie(adminCookie()).with(csrf())
                        .param("shortDescription", "Summary").param("instagramUrl", ""))
                .andExpect(status().isBadRequest());
        for (HttpMethod method : new HttpMethod[]{HttpMethod.PUT, HttpMethod.DELETE}) {
            String path = "/news/" + legacy.getId();
            mvc.perform(request(method, path).servletPath(path)).andExpect(status().isUnauthorized());
            mvc.perform(request(method, path).servletPath(path).header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken))
                    .andExpect(status().isForbidden());
        }
        mvc.perform(multipart("/news").servletPath("/news").cookie(adminCookie()))
                .andExpect(status().isForbidden());
        assertThat(newsRepository.count()).isEqualTo(1);
    }

    @Test
    @org.springframework.test.annotation.DirtiesContext(methodMode = org.springframework.test.annotation.DirtiesContext.MethodMode.BEFORE_METHOD)
    void editorSessionAndCsrfEndpointsUseExistingAdminIdentity() throws Exception {
        mvc.perform(get("/auth/me").servletPath("/auth/me")).andExpect(status().isUnauthorized());
        mvc.perform(get("/auth/me").servletPath("/auth/me").cookie(adminCookie()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.role").value("ADMIN"));
        mvc.perform(get("/auth/me").servletPath("/auth/me").header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken))
                .andExpect(status().isForbidden());
        var csrfResponse = mvc.perform(get("/auth/csrf").servletPath("/auth/csrf"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.headerName").value("X-XSRF-TOKEN"))
                .andReturn().getResponse();
        String csrfToken = json.readTree(csrfResponse.getContentAsString()).get("token").asText();
        mvc.perform(multipart("/news").servletPath("/news")
                        .cookie(adminCookie(), csrfResponse.getCookie("XSRF-TOKEN"))
                        .header("X-XSRF-TOKEN", csrfToken)
                        .param("shortDescription", "Real CSRF handshake").param("instagramUrl", ""))
                .andExpect(status().isOk());
    }

    private Admin account(String username, Role role) {
        return adminRepository.findByUsername(username).orElseGet(() -> adminRepository.save(
                Admin.builder().username(username).password("unused").role(role).build()));
    }

    private Cookie adminCookie() {
        return new Cookie("cookie-auth", adminToken);
    }

    private News addNews(String title, Boolean published, String publishedAt) {
        News news = new News();
        news.setShortDescription("Summary");
        news.setInstagramUrl(INSTAGRAM_URL);
        news.setTitle(title);
        news.setPublished(published);
        news.setPublishedAt(publishedAt == null ? null : Instant.parse(publishedAt));
        if (title != null) {
            news.setCategory(News.Category.LATEST_NEWS);
        }
        news.setCreatedAt(LocalDateTime.of(2024, 12, 1, 9, 0).minusDays(newsRepository.count()));
        return newsRepository.save(news);
    }

    private MockMultipartHttpServletRequestBuilder edit(long id) {
        MockMultipartHttpServletRequestBuilder request = multipart(HttpMethod.PUT, "/news/{id}", id);
        request.servletPath("/news/" + id).cookie(adminCookie()).with(csrf());
        return request;
    }

    private MockMultipartFile photo() {
        return new MockMultipartFile("image", "cover.png", "image/png", new byte[]{1, 2, 3});
    }

    private String assetPath(String imageUrl) {
        return URI.create(imageUrl).getPath().substring("/api".length());
    }

    private void removeTestImage(String imageUrl) throws Exception {
        if (imageUrl != null) {
            Files.deleteIfExists(Path.of(System.getProperty("user.dir"), assetPath(imageUrl).substring(1)));
        }
    }
}
