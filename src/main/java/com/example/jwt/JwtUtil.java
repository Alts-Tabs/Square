package com.example.jwt;

import com.example.data.UsersEntity;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.ZonedDateTime;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {
    private final Key key;
    private final long accessTokenExpTime;

    public JwtUtil(@Value("${jwt.secret}") String secretKey,
                   @Value("${jwt.expiration_time}") long accessTokenExpTime) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenExpTime = accessTokenExpTime;
    }

    /**
     * Create Access Token
     * @param user UsersEntity
     * @return Access_Token String
     */
    public String createAccessToken(UsersEntity user) {
        return createToken(user, accessTokenExpTime);
    }

    /**
     * Create JWT
     * @param user UserEntity
     * @param expireTime long
     * @return JWT String
     */
    public String createToken(UsersEntity user, long expireTime) {
        Claims claims = Jwts.claims();
        claims.put("username", user.getUsername());
        claims.put("role", user.getRole());

//        System.out.println(user.getName());
        claims.put("name", user.getName());

        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime tokenValidity = now.plusSeconds(expireTime);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(Date.from(now.toInstant()))
                .setExpiration(Date.from(tokenValidity.toInstant()))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extract username from Token
     * @param token String
     * @return username String
     */
    public String getUsername(String token) {
        return parseClaims(token).get("username", String.class);
    }

    /**
     * Extract name from Token
     * @param token String
     * @return name String
     */
    public String getName(String token) {
        return parseClaims(token).get("name", String.class);
    }

    /**
     * Extract role from Token
     * @param token String
     * @return role String
     */
    public String getRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    /**
     * JWT Validate
     * @param token String
     * @return IsValidate boolean
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT Claims String is Empty", e);
        }
        return false;
    }

    /**
     * JWT Claims Extract
     * @param accessToken String
     * @return JWT Claims
     */
    public Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

}
