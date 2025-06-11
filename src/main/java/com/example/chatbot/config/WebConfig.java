package com.example.chatbot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public WebClient clovaWebClientCustom(ClovaChatbotConfig.ChatbotProps props) {
        return WebClient.builder()
                .baseUrl(props.getUrl())
                .defaultHeader("Content-Type", "application/json")
                .clientConnector(new ReactorClientHttpConnector(HttpClient.create().responseTimeout(Duration.ofSeconds(10))))
                .build();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // 프론트엔드 URL (배포 시 실제 도메인으로 변경)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true) // HttpOnly 쿠키 전송 허용
                .maxAge(3600); // CORS preflight 캐싱 시간 (초)
    }
}