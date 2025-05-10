package com.cufre.expedientes.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseHealthIndicator(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Health health() {
        try {
            // Ejecutar una consulta simple para verificar la conexión
            Integer result = jdbcTemplate.queryForObject("SELECT 1 FROM DUAL", Integer.class);
            
            if (result != null && result == 1) {
                return Health.up()
                        .withDetail("database", "Oracle")
                        .withDetail("status", "Conexión establecida correctamente")
                        .build();
            } else {
                return Health.down()
                        .withDetail("database", "Oracle")
                        .withDetail("status", "La consulta de prueba no devolvió el resultado esperado")
                        .build();
            }
        } catch (Exception e) {
            log.error("Error al verificar la salud de la base de datos: {}", e.getMessage(), e);
            return Health.down()
                    .withDetail("database", "Oracle")
                    .withDetail("status", "Error al conectar")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
} 