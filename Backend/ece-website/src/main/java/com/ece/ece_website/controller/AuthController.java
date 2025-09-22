package com.ece.ece_website.controller;

import com.ece.ece_website.dto.AuthenticationRequest;
import com.ece.ece_website.dto.AuthenticationResponse;
import com.ece.ece_website.entity.Admin;
import com.ece.ece_website.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> auth(@RequestBody AuthenticationRequest request,
                                                       HttpServletResponse response) {
        AuthenticationResponse authenticationResponse = authService.authenticate(request);

        Cookie jwtCookie = new Cookie("cookie-auth", authenticationResponse.getToken());
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(4 * 60 * 60); // 4 hours
        response.addCookie(jwtCookie);

        return ResponseEntity.ok(authenticationResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("cookie-auth", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
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

            Cookie jwtCookie = new Cookie("cookie-auth", authResponse.getToken());
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(4 * 60 * 60); // 4 hours
            response.addCookie(jwtCookie);

            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
