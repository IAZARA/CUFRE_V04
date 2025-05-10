package com.cufre.expedientes.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración para controlar el manejo de recursos estáticos
 */
@Configuration
public class ResourceConfig implements WebMvcConfigurer {

    /**
     * Configura los manejadores de recursos estáticos
     * Excluye las rutas de autenticación del manejo de recursos estáticos
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Deshabilitar el manejo de recursos estáticos para rutas específicas
        registry.addResourceHandler("/api/auth/**")
                .addResourceLocations("classpath:/META-INF/resources/auth-disabled/")
                .resourceChain(false);
        
        // Mantener la configuración por defecto para el resto de recursos
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true);
    }
} 