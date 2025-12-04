package com.prodify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class ProdifyBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProdifyBackendApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") // Autoriser toutes les routes
						.allowedOrigins("http://localhost:5173") // Autoriser SEULEMENT le frontend
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Verbes autorisés
						.allowedHeaders("*")
						.allowCredentials(true);
			}
		};
	}
}
