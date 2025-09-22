package com.ece.ece_website.config;

import com.ece.ece_website.entity.Admin;
import com.ece.ece_website.entity.Role;
import com.ece.ece_website.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeDefaultAdmin();
    }

    private void initializeDefaultAdmin() {
        try {
            // Check if any admin users exist
            long adminCount = adminRepository.count();

            if (adminCount == 0) {
                logger.info("No admin users found. Creating default admin user...");

                Admin defaultAdmin = Admin.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .role(Role.ADMIN)
                        .build();

                adminRepository.save(defaultAdmin);

                logger.info("Default admin user created successfully with username: 'admin' and password: 'admin'");
                logger.warn("SECURITY WARNING: Please change the default admin password after first login!");
            } else {
                logger.info("Admin users already exist. Skipping default admin creation.");
            }
        } catch (Exception e) {
            logger.error("Error occurred while initializing default admin user: {}", e.getMessage(), e);
        }
    }
}