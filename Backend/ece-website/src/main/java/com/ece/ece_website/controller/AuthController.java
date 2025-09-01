package com.ece.ece_website.controller;

import com.ece.ece_website.dto.AuthenticationRequest;
import com.ece.ece_website.dto.AuthenticationResponse;
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
        ResponseEntity<AuthenticationResponse> ok = ResponseEntity.ok(authenticationResponse);

        Cookie jwtCookie = new Cookie("cookie-auth", authenticationResponse.getToken());
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // Set to true in production with HTTPS
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(24 * 60 * 60);
        response.addCookie(jwtCookie);

        // todo extend jwtFilter to check if cookie exists in header, check for bearer, if not deny,
        return ok;
    }
}
