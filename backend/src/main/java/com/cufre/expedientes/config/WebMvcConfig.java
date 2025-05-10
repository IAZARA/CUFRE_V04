package com.cufre.expedientes.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración para controlar el comportamiento de Spring MVC
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * Deshabilita el manejo de recursos estáticos por completo
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir archivos estáticos desde /uploads/**
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/Users/macbook/Documents/CUFRE_V04/backend/uploads/");
    }
    
    /**
     * Configura el sistema de coincidencia de rutas
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // No usar sufijos de rutas
        configurer.setUseTrailingSlashMatch(false);
        configurer.setUseRegisteredSuffixPatternMatch(false);
    }
} 