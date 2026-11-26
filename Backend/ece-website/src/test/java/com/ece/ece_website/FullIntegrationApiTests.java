package com.ece.ece_website;

import com.ece.ece_website.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import java.util.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest(properties={"spring.datasource.url=jdbc:h2:mem:full_api;DB_CLOSE_DELAY=-1","spring.jpa.hibernate.ddl-auto=create-drop"})
@AutoConfigureMockMvc
class FullIntegrationApiTests {
 @Autowired MockMvc mvc;
 @Autowired ObjectMapper json;
 @Autowired NewsRepository news;
 @Autowired ProjectRepository projects;
 @Autowired OpportunityRepository opportunities;
 @Autowired TrainingSessionRepository training;
 @BeforeEach void reset() { opportunities.deleteAll(); training.deleteAll(); news.deleteAll(); projects.deleteAll(); }

 @Test void newsDetailsValidateBlocksSlugsAndPublicPagination() throws Exception {
  String response=mvc.perform(multipart("/news").with(user("editor").authorities(()->"ADMIN"))
   .param("title","Test article").param("slug","test-article").param("shortDescription","Verified summary").param("instagramUrl","")
   .param("category","LATEST_NEWS").param("published","false")
   .param("contentJson","[{\"type\":\"paragraph\",\"text\":[{\"text\":\"Full text\",\"strong\":true}]}]"))
   .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  long id=json.readTree(response).path("id").asLong();
  mvc.perform(get("/news/slug/test-article")).andExpect(status().isNotFound());
  mvc.perform(get("/news/public")).andExpect(jsonPath("$.totalElements").value(0));
  mvc.perform(multipart(org.springframework.http.HttpMethod.PUT,"/news/"+id).with(user("editor").authorities(()->"ADMIN"))
   .param("published","true").param("publishedAt","2026-01-01T00:00:00Z"))
   .andExpect(status().isOk());
  mvc.perform(get("/news/slug/test-article")).andExpect(status().isOk()).andExpect(jsonPath("$.contentJson").value(org.hamcrest.Matchers.containsString("Full text")));
  mvc.perform(get("/news/public?size=1&category=LATEST_NEWS")).andExpect(jsonPath("$.totalElements").value(1));
  mvc.perform(get("/news/public?category=OPEN_CALL")).andExpect(jsonPath("$.totalElements").value(0));
  mvc.perform(get("/news/public?size=0")).andExpect(status().isBadRequest());
  mvc.perform(multipart("/news").with(user("editor").authorities(()->"ADMIN")).param("slug","test-article"))
   .andExpect(status().isConflict());
  mvc.perform(multipart(org.springframework.http.HttpMethod.PUT,"/news/"+id).with(user("editor").authorities(()->"ADMIN"))
   .param("contentJson","[{\"type\":\"paragraph\",\"text\":[{\"text\":\"Unsafe\",\"href\":\"javascript:alert(1)\"}]}]"))
   .andExpect(status().isBadRequest());
  assertThat(news.findById(id).orElseThrow().getContentJson()).contains("Full text");
 }

 @Test void projectCrudPreservesFilesAndUuidAndRejectsUnsafeUploads() throws Exception {
  var image=new MockMultipartFile("image","cover.png","image/png",new byte[]{1,2,3});
  var pdf=new MockMultipartFile("pdf","card.pdf","application/pdf","%PDF-1.4\n".getBytes());
  var response=mvc.perform(multipart("/projects").file(image).file(pdf).with(user("editor").authorities(()->"ADMIN"))
   .param("title","Local project").param("slug","local-project").param("budget","0").param("description","Verified project")
   .param("quickSummary","Summary").param("programme","Local test programme").param("status","ON_GOING"))
   .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  var record=json.readTree(response); String uuid=record.path("uuid").asText();
  mvc.perform(get("/projects/slug/local-project")).andExpect(jsonPath("$.uuid").value(uuid));
  mvc.perform(get("/projects/public?status=PAST")).andExpect(jsonPath("$.length()").value(0));
  mvc.perform(get(record.path("pdfUrl").asText().substring(4))).andExpect(status().isOk());
  mvc.perform(multipart(org.springframework.http.HttpMethod.PUT,"/projects/"+uuid).with(user("editor").authorities(()->"ADMIN"))
   .param("title","Edited project").param("budget","0").param("description","Changed").param("quickSummary","Summary").param("status","PAST"))
   .andExpect(status().isOk()).andExpect(jsonPath("$.image").value(record.path("image").asText())).andExpect(jsonPath("$.pdfUrl").value(record.path("pdfUrl").asText()));
  mvc.perform(get("/projects/get/"+uuid)).andExpect(jsonPath("$.title").value("Edited project"));
  mvc.perform(multipart("/projects").file(new MockMultipartFile("image","evil.svg","image/svg+xml","<svg/>".getBytes()))
   .with(user("editor").authorities(()->"ADMIN")).param("title","Invalid").param("budget","0").param("description","x").param("quickSummary","x"))
   .andExpect(status().isBadRequest());
  mvc.perform(delete("/projects/"+uuid).with(user("editor").authorities(()->"ADMIN"))).andExpect(status().isNoContent());
  mvc.perform(get("/projects/slug/local-project")).andExpect(status().isNotFound());
 }

 @Test void opportunitiesAndTrainingPersistPublishExpireUpdateAndDelete() throws Exception {
  for(String module:List.of("opportunities","training")) {
   String deadline=module.equals("training")?"registrationDeadline":"applicationDeadline";
   String publicPath=module.equals("training")?"/training/sessions":"/opportunities/public";
   Map<String,Object> body=new HashMap<>(Map.of("title","Local demo","slug","local-demo","availability","OPEN","published",false,deadline,"2025-01-01T00:00:00Z"));
   var created=mvc.perform(post("/"+module+"/admin").with(user("editor").authorities(()->"ADMIN")).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body)))
    .andExpect(status().isOk()).andExpect(jsonPath("$.lifecycle").value("UNPUBLISHED")).andReturn();
   long id=json.readTree(created.getResponse().getContentAsString()).path("id").asLong();
   mvc.perform(get(publicPath)).andExpect(jsonPath("$.length()").value(0));
   mvc.perform(get("/"+module+"/slug/local-demo")).andExpect(status().isNotFound());
   body.put("published",true);
   mvc.perform(put("/"+module+"/admin/"+id).with(user("editor").authorities(()->"ADMIN")).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body)))
    .andExpect(status().isOk()).andExpect(jsonPath("$.lifecycle").value("CLOSED"));
   mvc.perform(get(publicPath+"?status=OPEN")).andExpect(jsonPath("$.length()").value(0));
   body.put(deadline,"2100-01-01T00:00:00Z");body.put("opensAt","2099-01-01T00:00:00Z");
   mvc.perform(put("/"+module+"/admin/"+id).with(user("editor").authorities(()->"ADMIN")).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body)))
    .andExpect(jsonPath("$.lifecycle").value("UPCOMING"));
   body.remove("opensAt");
   mvc.perform(put("/"+module+"/admin/"+id).with(user("editor").authorities(()->"ADMIN")).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body)))
    .andExpect(jsonPath("$.lifecycle").value("OPEN"));
   mvc.perform(get("/"+module+"/slug/local-demo")).andExpect(jsonPath("$.id").value(id));
   mvc.perform(post("/"+module+"/admin").with(user("editor").authorities(()->"ADMIN")).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body)))
    .andExpect(status().isConflict());
   body.put("startDate","2026-02-01");body.put("endDate","2026-01-01");
   mvc.perform(put("/"+module+"/admin/"+id).with(user("editor").authorities(()->"ADMIN")).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body)))
    .andExpect(status().isBadRequest());
   mvc.perform(delete("/"+module+"/admin/"+id).with(user("editor").authorities(()->"ADMIN"))).andExpect(status().isNoContent());
   mvc.perform(get(publicPath)).andExpect(jsonPath("$.length()").value(0));
  }
 }

 @Test void allManagementWritesRequireAdminAndCookieCsrf() throws Exception {
  for(String path:List.of("/projects","/news","/opportunities/admin","/training/admin")) {
   mvc.perform(post(path).servletPath(path)).andExpect(status().isUnauthorized());
   mvc.perform(post(path).servletPath(path).with(user("reader").authorities(()->"USER"))).andExpect(status().isForbidden());
   mvc.perform(post(path).servletPath(path).with(user("editor").authorities(()->"ADMIN")).cookie(new Cookie("cookie-auth","test"))).andExpect(status().isForbidden());
  }
  for(String path:List.of("/opportunities/admin","/training/admin")) {
   mvc.perform(get(path)).andExpect(status().isUnauthorized());
   mvc.perform(get(path).with(user("reader").authorities(()->"USER"))).andExpect(status().isForbidden());
  }
  mvc.perform(post("/messages/").with(user("editor").authorities(()->"ADMIN"))).andExpect(status().isNotFound());
 }
}
