package com.example.jwt;

import com.example.repository.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");
        System.out.println("Authorization: "+authorizationHeader);

        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            System.out.println("분리된 토큰: "+token);

            if(jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsername(token);
                System.out.println("검증된 아이디: "+username);

                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username.toString());

                if(userDetails != null) {
                    UsernamePasswordAuthenticationToken usernamePassAuthToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(usernamePassAuthToken);
                }

            }

        }
        filterChain.doFilter(request, response);
    }
}
