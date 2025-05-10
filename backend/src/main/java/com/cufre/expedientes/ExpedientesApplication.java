package com.cufre.expedientes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration;

/**
 * Aplicación principal para el sistema de expedientes.
 */
@SpringBootApplication(exclude = {
    ErrorMvcAutoConfiguration.class
})
public class ExpedientesApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExpedientesApplication.class, args);
    }
} 