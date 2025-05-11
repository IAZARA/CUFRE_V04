package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.ExpedienteDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.junit.jupiter.api.BeforeEach;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ExpedienteServicePriorityTest {

    @Autowired
    private ExpedienteService expedienteService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    public void limpiarTabla() {
        jdbcTemplate.execute("DELETE FROM EXPEDIENTE");
    }

    @Test
    void testPrioridadConCamposDeImpacto() {
        ExpedienteDTO dto = new ExpedienteDTO();
        // Setear valores base
        dto.setNumero("TEST-123");
        dto.setProfugoProfesionOcupacion("PROFESIONAL");
        dto.setProfugoNumeroDetencionesPrevias(3);
        dto.setNumeroComplices(4);
        dto.setTipoCaptura("NACIONAL");
        dto.setTipoVictima("JUEZ");
        dto.setMediaticoFlag(true);
        dto.setReincicenteFlag(true);
        dto.setReiteranteFlag(false);
        dto.setBandaFlag(true);
        dto.setTerrorismoFlag(false);
        dto.setNivelOrganizacion("COMPLEJA");
        dto.setAmbitoBanda("INTERNACIONAL");
        dto.setCapacidadOperativa("ALTA");
        dto.setPlanificacionFlag(true);
        dto.setConexionesOtrasActividadesFlag(true);
        dto.setImpactoSocial("ALTO");
        dto.setTipoDano("FISICO");
        dto.setUsoArmasFuegoFlag(true);
        dto.setUsoArmasBlancasFlag(false);

        // Campos nuevos
        dto.setNivelIncidenciaZona("ALTA");
        dto.setInstitucionSensibleCercana("HOSPITAL");
        dto.setRecursosLimitados("SI");
        dto.setAreaFronteriza("NO");
        dto.setImpactoPercepcion("MEDIA");

        // Crear expediente
        ExpedienteDTO creado = expedienteService.create(dto);

        // Calcular la prioridad esperada manualmente según los valores y la lógica de PriorityCalculator
        int prioridadEsperada = 0;
        prioridadEsperada += 800; // PROFESIONAL
        prioridadEsperada += 750; // 3 detenciones
        prioridadEsperada += 250; // 4 cómplices
        prioridadEsperada += 500; // NACIONAL
        prioridadEsperada += 1000; // JUEZ
        prioridadEsperada += 500; // mediático
        prioridadEsperada += 800; // reincidente
        // reiterante = false
        prioridadEsperada += 500; // banda
        // terrorismo = false
        prioridadEsperada += 800; // COMPLEJA
        prioridadEsperada += 1000; // INTERNACIONAL
        prioridadEsperada += 1000; // ALTA capacidad
        prioridadEsperada += 500; // planificación
        prioridadEsperada += 500; // conexiones otras actividades
        prioridadEsperada += 500; // impacto social ALTO
        prioridadEsperada += 250; // tipo daño FISICO
        prioridadEsperada += 500; // uso armas fuego
        // uso armas blancas = false
        prioridadEsperada += 500; // nivel incidencia zona ALTA
        prioridadEsperada += 500; // institución HOSPITAL
        prioridadEsperada += 500; // recursos limitados SI
        prioridadEsperada += 100; // área fronteriza NO
        prioridadEsperada += 250; // impacto percepción MEDIA

        assertEquals(prioridadEsperada, creado.getPrioridad(), "La prioridad calculada no es la esperada");

        // Verificar que los campos se guardaron correctamente
        assertEquals("ALTA", creado.getNivelIncidenciaZona());
        assertEquals("HOSPITAL", creado.getInstitucionSensibleCercana());
        assertEquals("SI", creado.getRecursosLimitados());
        assertEquals("NO", creado.getAreaFronteriza());
        assertEquals("MEDIA", creado.getImpactoPercepcion());
    }
} 