package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.Persona;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class PersonaRepositoryTest {

    @Autowired
    private PersonaRepository personaRepository;

    @Test
    public void testFindByTipoDocumentoAndNumeroDocumento() {
        // Dado una persona en la base de datos
        Persona persona = new Persona();
        persona.setNombre("Juan");
        persona.setApellido("Pérez");
        persona.setTipoDocumento("DNI");
        persona.setNumeroDocumento("34567890");
        personaRepository.save(persona);

        // Cuando se busca por tipo y número de documento
        Optional<Persona> resultado = personaRepository.findByTipoDocumentoAndNumeroDocumento("DNI", "34567890");

        // Entonces
        assertTrue(resultado.isPresent());
        assertEquals("Juan", resultado.get().getNombre());
        assertEquals("Pérez", resultado.get().getApellido());
    }

    @Test
    public void testFindByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase() {
        // Dadas varias personas en la base de datos
        Persona persona1 = new Persona();
        persona1.setNombre("Juan Carlos");
        persona1.setApellido("Pérez");
        
        Persona persona2 = new Persona();
        persona2.setNombre("María");
        persona2.setApellido("González");
        
        Persona persona3 = new Persona();
        persona3.setNombre("Roberto");
        persona3.setApellido("Juárez");
        
        personaRepository.saveAll(List.of(persona1, persona2, persona3));

        // Cuando se busca por parte del nombre o apellido
        List<Persona> resultadoNombre = personaRepository.findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase("JUAN", "");
        List<Persona> resultadoApellido = personaRepository.findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase("", "REZ");

        // Entonces
        assertEquals(1, resultadoNombre.size());
        assertEquals("Juan Carlos", resultadoNombre.get(0).getNombre());
        
        assertEquals(2, resultadoApellido.size());
        assertTrue(resultadoApellido.stream().anyMatch(p -> p.getApellido().equals("Pérez")));
        assertTrue(resultadoApellido.stream().anyMatch(p -> p.getApellido().equals("Juárez")));
    }

    @Test
    public void testFindByNacionalidad() {
        // Dadas varias personas con diferentes nacionalidades
        Persona persona1 = new Persona();
        persona1.setNombre("Juan");
        persona1.setApellido("Pérez");
        persona1.setNacionalidad("ARGENTINA");
        
        Persona persona2 = new Persona();
        persona2.setNombre("María");
        persona2.setApellido("González");
        persona2.setNacionalidad("ARGENTINA");
        
        Persona persona3 = new Persona();
        persona3.setNombre("Paolo");
        persona3.setApellido("Rossi");
        persona3.setNacionalidad("ITALIANA");
        
        personaRepository.saveAll(List.of(persona1, persona2, persona3));

        // Cuando se busca por nacionalidad
        List<Persona> argentinos = personaRepository.findByNacionalidad("ARGENTINA");
        List<Persona> italianos = personaRepository.findByNacionalidad("ITALIANA");

        // Entonces
        assertEquals(2, argentinos.size());
        assertEquals(1, italianos.size());
        assertEquals("Paolo", italianos.get(0).getNombre());
    }
} 