package com.ece.ece_website.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private final Key signingKey;

    public JwtService(@Value("${app.security.jwt-secret}") String secret) {
        try {
            signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        } catch (RuntimeException exception) {
            throw new IllegalStateException("APP_JWT_SECRET must contain a Base64-encoded key of at least 32 random bytes.");
        }
    }

    public String extractUsername(String jwtToken) {
        return extractClaim(jwtToken, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder().setClaims(claims).setSubject(userDetails.getUsername())
            .setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 4 * 60 * 60 * 1000L))
            .signWith(signingKey, SignatureAlgorithm.HS256).compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject().equals(userDetails.getUsername()) && claims.getExpiration().after(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token).getBody();
    }
}
