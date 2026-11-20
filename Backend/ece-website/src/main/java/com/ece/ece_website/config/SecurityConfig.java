package com.ece.ece_website.config;

import com.ece.ece_website.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.csrfTokenRepository(new CookieCsrfTokenRepository())
                                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                                        // Preserve bearer clients; every cookie-authenticated write requires CSRF.
                                        .requireCsrfProtectionMatcher(request -> {
                                                if (
                                                    java.util.Set.of("GET", "HEAD", "OPTIONS").contains(request.getMethod())) return false;
                                                var cookies = request.getCookies();
                                                return cookies != null && java.util.Arrays.stream(cookies)
                                                        .anyMatch(cookie -> "cookie-auth".equals(cookie.getName()));
                                        }))
                                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                org.springframework.web.cors.CorsUtils::isPreFlightRequest)
                                                .permitAll()
                                                .requestMatchers("/auth/register").hasAuthority(Role.ADMIN.name())
                                                .requestMatchers("/auth/me").hasAuthority(Role.ADMIN.name())
                                                .requestMatchers("/auth/**").permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .requestMatchers("/opportunities/admin/**", "/training/admin/**").hasAuthority(Role.ADMIN.name())
                                                .requestMatchers(HttpMethod.GET, "/opportunities/public", "/opportunities/slug/**", "/training/sessions", "/training/slug/**").permitAll()
                                                .requestMatchers("/opportunities/**", "/training/**").hasAuthority(Role.ADMIN.name())
                                                .requestMatchers(HttpMethod.GET, "/projects/**").permitAll()
                                                .requestMatchers("/projects/**").hasAuthority(Role.ADMIN.name())
                                                .requestMatchers(HttpMethod.GET, "/news/**").permitAll()
                                                .requestMatchers(HttpMethod.HEAD, "/news/**").permitAll()
                                                .requestMatchers("/news/**").hasAuthority(Role.ADMIN.name())
                                                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                                                .requestMatchers(HttpMethod.HEAD, "/uploads/news/**").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/messages/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/messages/**").hasAuthority(Role.ADMIN.name())
                                                .requestMatchers(HttpMethod.DELETE, "/messages/**").hasAuthority(Role.ADMIN.name())
                                                .requestMatchers("/h2-console/**").denyAll()
                                                .requestMatchers("/test/public").permitAll()
                                                .requestMatchers("/test/secure").authenticated()
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .exceptionHandling(errors -> errors.authenticationEntryPoint((request, response, exception) -> response.sendError(401)))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
                configuration.setAllowedOrigins(java.util.List.of("http://localhost:5173"));
                configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type", "X-Requested-With",
                                "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
                configuration.setAllowCredentials(true);
                org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
