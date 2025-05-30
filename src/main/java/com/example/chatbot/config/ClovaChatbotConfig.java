package com.example.chatbot.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class ClovaChatbotConfig {

    @Data
    @ConfigurationProperties(prefix = "clova.chatbot.api")
    public static class ChatbotProps {
        private String url;
        private String key; // 시그니처 생성용 Secret Key
        private String apiGatewayKey; // API Gateway 키
    }

    @Bean
    public WebClient clovaWebClient(ChatbotProps props) {
        return WebClient.builder()
                .baseUrl(props.getUrl())
                .defaultHeader("Content-Type", "application/json") // 기본 헤더 설정
                .build();
    }

    @Bean
    public ChatbotProps chatbotProps() {
        return new ChatbotProps();
    }
}