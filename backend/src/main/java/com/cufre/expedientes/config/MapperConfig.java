package com.cufre.expedientes.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración para habilitar los mappers de MapStruct en el contexto de Spring.
 */
@Configuration
@ComponentScan(basePackages = "com.cufre.expedientes.mapper")
public class MapperConfig {
} 