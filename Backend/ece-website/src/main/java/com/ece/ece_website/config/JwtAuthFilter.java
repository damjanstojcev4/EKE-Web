package com.ece.ece_website.config;

import com.ece.ece_website.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        logger.debug("Request: {} {}", request.getMethod(), request.getRequestURI());

        // Skip JWT processing for public endpoints
        if (isPublicEndpoint(request)) {
            logger.debug("Skipping JWT check for public endpoint");
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = extractJwtFromRequest(request);
        logger.debug("JWT found: {}", jwt != null);

        if (jwt == null) {
            logger.warn("No JWT token found for protected endpoint");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: No token provided");
            return;
        }

        try {
            final String username = jwtService.extractUsername(jwt);
            logger.debug("Extracted username from token: {}", username);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                logger.debug("User details loaded: {}", userDetails.getUsername());

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    logger.debug("Token is valid, setting authentication");
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    logger.warn("Token is invalid");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Unauthorized: Invalid token");
                    return;
                }
            }
        } catch (Exception e) {
            logger.error("JWT processing error: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Token processing error");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(HttpServletRequest request) {
        String path = request.getServletPath();
        String method = request.getMethod();

        return path.startsWith("/auth/") ||
                (path.startsWith("/projects") && "GET".equalsIgnoreCase(method)) ||
                (path.startsWith("/uploads") && "GET".equalsIgnoreCase(method)) ||
                (path.startsWith("/messages") && "POST".equalsIgnoreCase(method)) ||
                path.startsWith("/h2-console");
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        // Check cookies first
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("cookie-auth".equals(cookie.getName())) {
                    logger.debug("Found JWT in cookie");
                    return cookie.getValue();
                }
            }
        }

        // Check Authorization header
        final String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            logger.debug("Found JWT in Authorization header");
            return authHeader.substring(7);
        }

        logger.debug("No JWT found in request");
        return null;
    }
}