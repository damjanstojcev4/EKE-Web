package com.ece.ece_website.config;

import com.ece.ece_website.entity.Admin;
import com.ece.ece_website.entity.Role;
import com.ece.ece_website.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    @Value("${app.security.bootstrap-username:}")
    private String username;
    @Value("${app.security.bootstrap-password:}")
    private String password;

    @Override
    public void run(String... args) {
        if (adminRepository.existsByRole(Role.ADMIN)) return;
        if (username.isBlank() && password.isBlank()) return;
        if (username.isBlank() || username.length() > 100 || password.length() < 12 || password.length() > 72) {
            throw new IllegalStateException("Bootstrap requires a username and a password of 12–72 characters.");
        }
        if (adminRepository.findByUsername(username.trim()).isPresent()) {
            throw new IllegalStateException("Bootstrap username already belongs to an existing account.");
        }
        adminRepository.save(Admin.builder().username(username.trim())
            .password(passwordEncoder.encode(password)).role(Role.ADMIN).build());
        // Never log bootstrap credentials. Remove them from the environment after provisioning.
    }
}
