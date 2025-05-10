package com.cufre.expedientes.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test") // Asegúrate de tener un perfil de prueba configurado en application-test.properties
public class FlywayMigrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void testTablesExist() {
        // Verificar que las tablas principales existan
        List<String> tables = List.of("USUARIO", "EXPEDIENTE", "PERSONA", "PERSONA_EXPEDIENTE", 
                                    "DOMICILIO", "MEDIOS_DE_COMUNICACION", "FOTOGRAFIA", 
                                    "DOCUMENTO", "DELITO", "EXPEDIENTE_DELITO");
        
        for (String table : tables) {
            int count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM USER_TABLES WHERE TABLE_NAME = ?", 
                Integer.class, 
                table
            );
            assertTrue(count > 0, "La tabla " + table + " no existe");
        }
    }
    
    @Test
    public void testUsuarioAdminExists() {
        // Verificar que exista el usuario administrador
        List<Map<String, Object>> results = jdbcTemplate.queryForList(
            "SELECT * FROM USUARIO WHERE ROL = 'ADMIN' AND NOMBRE = 'Administrador'"
        );
        
        assertTrue(!results.isEmpty(), "El usuario administrador no existe");
        assertEquals(1, results.size(), "Debería haber exactamente un usuario administrador");
    }
    
    @Test
    public void testDelitosExist() {
        // Verificar que se hayan cargado los delitos
        int count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM DELITO", 
            Integer.class
        );
        
        assertTrue(count >= 10, "Deberían existir al menos 10 delitos en la base de datos");
    }
    
    @Test
    public void testSampleDataExists() {
        // Verificar que existan datos de muestra
        int personaCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM PERSONA", 
            Integer.class
        );
        
        int expedienteCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM EXPEDIENTE", 
            Integer.class
        );
        
        int domicilioCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM DOMICILIO", 
            Integer.class
        );
        
        assertTrue(personaCount >= 4, "Deberían existir al menos 4 personas en la base de datos");
        assertTrue(expedienteCount >= 3, "Deberían existir al menos 3 expedientes en la base de datos");
        assertTrue(domicilioCount >= 5, "Deberían existir al menos 5 domicilios en la base de datos");
    }
    
    @Test
    public void testForeignKeyConstraints() {
        // Verificar que las restricciones de clave foránea estén correctamente configuradas
        List<Map<String, Object>> constraints = jdbcTemplate.queryForList(
            "SELECT * FROM USER_CONSTRAINTS WHERE CONSTRAINT_TYPE = 'R'"
        );
        
        assertTrue(constraints.size() >= 7, "Deberían existir al menos 7 restricciones de clave foránea");
    }
} 