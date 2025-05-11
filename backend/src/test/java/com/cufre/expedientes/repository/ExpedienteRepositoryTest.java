package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.Expediente;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.jdbc.core.JdbcTemplate;
import org.junit.jupiter.api.BeforeEach;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class ExpedienteRepositoryTest {

    @Autowired
    private ExpedienteRepository expedienteRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    public void limpiarTabla() {
        jdbcTemplate.execute("DELETE FROM EXPEDIENTE");
    }

    @Test
    public void testFindByNumero() {
        // Dado un expediente en la base de datos
        Expediente expediente = new Expediente();
        expediente.setNumero("EXP-2023-001");
        expediente.setFechaIngreso(LocalDate.now());
        expediente.setEstadoSituacion("ACTIVO");
        expedienteRepository.save(expediente);

        // Cuando se busca por número
        Optional<Expediente> resultado = expedienteRepository.findByNumero("EXP-2023-001");

        // Entonces
        assertTrue(resultado.isPresent());
        assertEquals("EXP-2023-001", resultado.get().getNumero());
    }

    @Test
    public void testFindByEstadoSituacion() {
        // Dado varios expedientes en diferentes estados
        Expediente expediente1 = new Expediente();
        expediente1.setNumero("EXP-2023-001");
        expediente1.setEstadoSituacion("ACTIVO");
        
        Expediente expediente2 = new Expediente();
        expediente2.setNumero("EXP-2023-002");
        expediente2.setEstadoSituacion("ACTIVO");
        
        Expediente expediente3 = new Expediente();
        expediente3.setNumero("EXP-2023-003");
        expediente3.setEstadoSituacion("CERRADO");
        
        expedienteRepository.saveAll(List.of(expediente1, expediente2, expediente3));

        // Cuando se busca por estado
        List<Expediente> activos = expedienteRepository.findByEstadoSituacion("ACTIVO");
        List<Expediente> cerrados = expedienteRepository.findByEstadoSituacion("CERRADO");

        // Entonces
        assertEquals(2, activos.size());
        assertEquals(1, cerrados.size());
    }

    @Test
    public void testFindByFechaIngresoBetween() {
        // Dado varios expedientes con diferentes fechas de ingreso
        Expediente expediente1 = new Expediente();
        expediente1.setNumero("EXP-2023-001");
        expediente1.setFechaIngreso(LocalDate.of(2023, 1, 15));
        
        Expediente expediente2 = new Expediente();
        expediente2.setNumero("EXP-2023-002");
        expediente2.setFechaIngreso(LocalDate.of(2023, 3, 20));
        
        Expediente expediente3 = new Expediente();
        expediente3.setNumero("EXP-2023-003");
        expediente3.setFechaIngreso(LocalDate.of(2023, 5, 10));
        
        expedienteRepository.saveAll(List.of(expediente1, expediente2, expediente3));

        // Cuando se busca por rango de fechas
        List<Expediente> expedientes = expedienteRepository.findByFechaIngresoBetween(
                LocalDate.of(2023, 2, 1), 
                LocalDate.of(2023, 4, 30));

        // Entonces
        assertEquals(1, expedientes.size());
        assertEquals("EXP-2023-002", expedientes.get(0).getNumero());
    }
} 