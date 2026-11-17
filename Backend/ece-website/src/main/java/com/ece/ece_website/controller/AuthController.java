package com.ece.ece_website.controller;

import com.ece.ece_website.dto.AuthenticationRequest;
import com.ece.ece_website.entity.Admin;
import com.ece.ece_website.service.AuthService;
import com.ece.ece_website.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final CsrfTokenRepository csrfTokenRepository;
    @Value("${app.security.cookie-secure:true}")
    private boolean secureCookies;

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken csrfToken, HttpServletResponse response) {
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        return Map.of("token", csrfToken.getToken(), "headerName", csrfToken.getHeaderName());
    }

    @PostMapping("/authenticate")
    public Map<String, String> authenticate(@RequestBody AuthenticationRequest credentials,
            HttpServletRequest request, HttpServletResponse response) {
        Admin admin = authService.authenticate(credentials);
        response.addHeader(HttpHeaders.SET_COOKIE, authCookie(jwtService.generateToken(admin), Duration.ofHours(4)).toString());
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        csrfTokenRepository.saveToken(null, request, response);
        return identity(admin);
    }

    @GetMapping("/me")
    public Map<String, String> me(@AuthenticationPrincipal Admin admin, HttpServletResponse response) {
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        return identity(admin);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, authCookie("", Duration.ZERO).toString());
        csrfTokenRepository.saveToken(null, request, response);
        SecurityContextHolder.clearContext();
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody AuthenticationRequest request) {
        // Account creation must not replace the caller's authenticated session.
        return ResponseEntity.status(HttpStatus.CREATED).body(identity(authService.register(request)));
    }

    private ResponseCookie authCookie(String value, Duration maxAge) {
        return ResponseCookie.from("cookie-auth", value).httpOnly(true).secure(secureCookies)
            .sameSite("Strict").path("/api").maxAge(maxAge).build();
    }

    private Map<String, String> identity(Admin admin) {
        return Map.of("username", admin.getUsername(), "role", admin.getRole().name());
    }
}
