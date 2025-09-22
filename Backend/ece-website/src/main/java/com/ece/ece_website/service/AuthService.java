package com.ece.ece_website.service;

import com.ece.ece_website.dto.AuthenticationRequest;
import com.ece.ece_website.dto.AuthenticationResponse;
import com.ece.ece_website.entity.Admin;
import com.ece.ece_website.entity.Role;
import com.ece.ece_website.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AdminRepository repository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = repository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    @Transactional
    public AuthenticationResponse register(Admin admin) {
        if (usernameExists(admin.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Ensure role is set
        if (admin.getRole() == null) {
            admin.setRole(Role.ADMIN);
        }

        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        var savedUser = repository.save(admin);

        // Verify the user was saved
        var verifiedUser = repository.findByUsername(savedUser.getUsername())
                .orElseThrow(() -> new RuntimeException("User not saved properly"));

        var jwtToken = jwtService.generateToken(verifiedUser);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public boolean usernameExists(String username) {
        return repository.findByUsername(username).isPresent();
    }
}
