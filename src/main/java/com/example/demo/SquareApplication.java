package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@ComponentScan("com.example.*")
@EntityScan("com.example.data")
@EnableJpaRepositories("com.example.repository")
public class SquareApplication {

	public static void main(String[] args) {
		SpringApplication.run(SquareApplication.class, args);
	}

}
