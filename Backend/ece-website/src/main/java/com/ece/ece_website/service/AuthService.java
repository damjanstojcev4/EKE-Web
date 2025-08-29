package com.ece.ece_website.service;

import com.ece.ece_website.dto.AuthenticationRequest;
import com.ece.ece_website.dto.AuthenticationResponse;
import com.ece.ece_website.dto.RegisterRequest;
import com.ece.ece_website.entity.Admin;
import com.ece.ece_website.entity.Role;
import com.ece.ece_website.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AdminRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var admin = Admin.builder()
                .username(request.getUsername())
                .password(encoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        repository.save(admin);

        var jwtToken = jwtService.generateToken(admin);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = repository.findByUsername(request.getUsername())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
