package com.ece.ece_website;

import com.ece.ece_website.dto.AuthenticationRequest;
import com.ece.ece_website.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AdminAuthorizationTests {
    @Autowired MockMvc mvc;
    @Autowired AuthService service;
    private static final String ACCOUNT = "{\"username\":\"new-admin\",\"password\":\"Test-only-long-password\"}";

    @Test void anonymousCannotRegisterOrReadMessages() throws Exception {
        mvc.perform(post("/auth/register").with(csrf()).contentType("application/json").content(ACCOUNT)).andExpect(status().isUnauthorized());
        mvc.perform(get("/messages/")).andExpect(status().isUnauthorized());
        mvc.perform(post("/projects").with(csrf())).andExpect(status().isUnauthorized());
        mvc.perform(delete("/news/1").with(csrf())).andExpect(status().isUnauthorized());
    }
    @Test @WithMockUser(roles="USER") void userCannotManageAnyResourceOrRegister() throws Exception {
        mvc.perform(post("/auth/register").with(csrf()).contentType("application/json").content(ACCOUNT)).andExpect(status().isForbidden());
        for (String path : new String[]{"/projects/00000000-0000-0000-0000-000000000001", "/news/1", "/messages/1"}) {
            mvc.perform(delete(path).with(csrf())).andExpect(status().isForbidden());
        }
        mvc.perform(post("/projects").with(csrf())).andExpect(status().isForbidden());
        mvc.perform(put("/news/1").with(csrf())).andExpect(status().isForbidden());
        mvc.perform(get("/messages/")).andExpect(status().isForbidden());
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("user", "unused", java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER"))));
        assertThrows(AccessDeniedException.class, () -> service.register(new AuthenticationRequest()));
    }
    @Test @WithMockUser(roles="ADMIN") void adminCanCreateAccountWithoutReceivingTokenOrCookie() throws Exception {
        mvc.perform(post("/auth/register").with(csrf()).contentType("application/json").content(ACCOUNT))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.role").value("ADMIN"))
            .andExpect(jsonPath("$.token").doesNotExist()).andExpect(header().doesNotExist("Set-Cookie"));
        mvc.perform(get("/messages/")).andExpect(status().isOk());
    }
    @Test @WithMockUser(roles="ADMIN") void mutationsRequireCsrfEvenForAdmin() throws Exception {
        mvc.perform(post("/auth/register").contentType("application/json").content(ACCOUNT)).andExpect(status().isForbidden());
        mvc.perform(delete("/news/1")).andExpect(status().isForbidden());
        mvc.perform(post("/auth/logout")).andExpect(status().isForbidden());
    }
    @Test void invalidTokenIsRejectedAndPublicReadsRemainAvailable() throws Exception {
        mvc.perform(get("/auth/me").header("Authorization", "Bearer invalid-token")).andExpect(status().isUnauthorized());
        mvc.perform(get("/projects/")).andExpect(status().isOk());
        mvc.perform(get("/news")).andExpect(status().isOk());
        mvc.perform(get("/auth/csrf")).andExpect(status().isOk()).andExpect(jsonPath("$.token").isNotEmpty());
    }
}
