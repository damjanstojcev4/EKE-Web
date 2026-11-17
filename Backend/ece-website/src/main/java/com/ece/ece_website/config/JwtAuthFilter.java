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

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        // A stale cookie must not prevent acquiring CSRF or signing in again.
        String path = request.getServletPath();
        boolean publicRequest = ("GET".equals(request.getMethod()) &&
            ("/auth/csrf".equals(path) || path.startsWith("/projects/") || path.equals("/projects") ||
             path.startsWith("/news/") || path.equals("/news") || path.startsWith("/uploads/"))) ||
            ("POST".equals(request.getMethod()) && ("/auth/authenticate".equals(path) ||
             "/messages".equals(path) || "/messages/".equals(path)));
        if (!publicRequest && SecurityContextHolder.getContext().getAuthentication() == null) {
            String token = extractToken(request);
            if (token != null) {
                try {
                    UserDetails user = userDetailsService.loadUserByUsername(jwtService.extractUsername(token));
                    if (!jwtService.isTokenValid(token, user)) throw new IllegalArgumentException("Invalid token");
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } catch (RuntimeException exception) {
                    SecurityContextHolder.clearContext();
                    response.setStatus(401);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"Your session has expired. Please sign in again.\"}");
                    return;
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) return authorization.substring(7);
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("cookie-auth".equals(cookie.getName())) return cookie.getValue();
            }
        }
        return null;
    }
}
