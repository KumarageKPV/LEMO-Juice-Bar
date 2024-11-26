package com.example.mywebapp.util;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // Apply CORS to all endpoints under /api
                .allowedOrigins("http://localhost:3000") // Allow frontend to make requests (change to your frontend URL)
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allow specific methods
                .allowedHeaders("*")  // Allow any header
                .allowCredentials(true);  // Allow credentials if needed (e.g., cookies, authorization headers)
    }
}
