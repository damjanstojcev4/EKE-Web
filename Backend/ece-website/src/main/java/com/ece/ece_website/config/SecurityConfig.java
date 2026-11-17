package com.ece.ece_website.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    @Value("${app.security.cookie-secure:true}")
    private boolean secureCookies;
    @Value("${app.security.allowed-origins:}")
    private String allowedOrigins;

    @Bean
    public CookieCsrfTokenRepository csrfTokenRepository() {
        CookieCsrfTokenRepository repository = new CookieCsrfTokenRepository();
        repository.setCookiePath("/api");
        repository.setCookieCustomizer(cookie -> cookie.httpOnly(true).secure(secureCookies).sameSite("Strict"));
        return repository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.csrfTokenRepository(csrfTokenRepository())
                // The explicit JSON endpoint returns the raw token for the request header.
                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                // This public contact form has no authenticated privilege/session dependency.
                .ignoringRequestMatchers(request -> "POST".equals(request.getMethod()) &&
                    ("/messages".equals(request.getServletPath()) || "/messages/".equals(request.getServletPath()))))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(org.springframework.web.cors.CorsUtils::isPreFlightRequest).permitAll()
                .requestMatchers(HttpMethod.GET, "/auth/csrf").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/authenticate").permitAll()
                .requestMatchers("/auth/register", "/auth/me", "/auth/logout").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/projects/**", "/news/**", "/uploads/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/messages", "/messages/").permitAll()
                .requestMatchers("/projects/**", "/news/**", "/messages/**").hasRole("ADMIN")
                .requestMatchers("/error").permitAll()
                .anyRequest().denyAll())
            .exceptionHandling(errors -> errors
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setStatus(401);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"Sign in to continue.\"}");
                })
                .accessDeniedHandler((request, response, exception) -> {
                    response.setStatus(403);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"This request is not permitted.\"}");
                }))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(Arrays.stream(allowedOrigins.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList());
        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cors.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-XSRF-TOKEN"));
        cors.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }
}
