package com.ece.ece_website.controller;

import com.ece.ece_website.dto.AuthenticationRequest;
import com.ece.ece_website.dto.AuthenticationResponse;
import com.ece.ece_website.entity.Admin;
import com.ece.ece_website.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @Value("${app.security.cookie-secure:true}")
    private boolean secureCookies;

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken token, HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-store");
        return Map.of("token", token.getToken(), "headerName", token.getHeaderName());
    }

    @GetMapping("/me")
    public Map<String, String> me(@AuthenticationPrincipal Admin admin, HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-store");
        return Map.of("username", admin.getUsername(), "role", admin.getRole().name());
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> auth(@RequestBody AuthenticationRequest request,
                                                       HttpServletResponse response) {
        AuthenticationResponse authenticationResponse = authService.authenticate(request);

        setAuthCookie(response, authenticationResponse.getToken(), 4 * 60 * 60);

        response.setHeader("Cache-Control", "no-store");
        return ResponseEntity.ok(authenticationResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        setAuthCookie(response, "", 0);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthenticationRequest request, HttpServletResponse response) {
        try {
            Admin admin = Admin.builder()
                    .username(request.getUsername())
                    .password(request.getPassword())
                    .build();

            AuthenticationResponse authResponse = authService.register(admin);

            setAuthCookie(response, authResponse.getToken(), 4 * 60 * 60);

            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    private void setAuthCookie(HttpServletResponse response, String token, long seconds) {
        response.addHeader("Set-Cookie", ResponseCookie.from("cookie-auth", token)
                .httpOnly(true).secure(secureCookies).sameSite("Strict").path("/").maxAge(seconds).build().toString());
    }
}
