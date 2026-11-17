package com.ece.ece_website.service;

import com.ece.ece_website.dto.AuthenticationRequest;
import com.ece.ece_website.entity.Admin;
import com.ece.ece_website.entity.Role;
import com.ece.ece_website.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AdminRepository repository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public Admin authenticate(AuthenticationRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            throw new BadCredentialsException("Invalid username or password.");
        }
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        Admin admin = repository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BadCredentialsException("Invalid username or password."));
        if (admin.getRole() != Role.ADMIN) throw new AccessDeniedException("Administrator access is required.");
        return admin;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Admin register(AuthenticationRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank() || request.getUsername().length() > 100 ||
            request.getPassword() == null || request.getPassword().length() < 12 || request.getPassword().length() > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use a username up to 100 characters and a password of 12–72 characters.");
        }
        String username = request.getUsername().trim();
        if (repository.findByUsername(username).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists.");
        }
        return repository.save(Admin.builder().username(username)
            .password(passwordEncoder.encode(request.getPassword())).role(Role.ADMIN).build());
    }
}
