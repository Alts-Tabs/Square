package com.example.chatbot.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClovaChatbotConfig {

    @Data
    @ConfigurationProperties(prefix = "clova.chatbot.api")
    public static class ChatbotProps {
        private String url;
        private String key;
        private String apiGatewayKey;
    }

    @Bean
    public ChatbotProps chatbotProps() {
        return new ChatbotProps();
    }
}