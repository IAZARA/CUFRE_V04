package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.PersonaDTO;
import com.cufre.expedientes.model.Persona;
import com.cufre.expedientes.service.PersonaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para operaciones relacionadas con personas.
 */
@RestController
@RequestMapping("/personas")
@Slf4j
public class PersonaController extends AbstractBaseController<Persona, PersonaDTO, Long> {
    
    private final PersonaService personaService;
    
    public PersonaController(PersonaService service) {
        super(service);
        this.personaService = service;
    }
    
    @GetMapping("/search/documento")
    public ResponseEntity<List<PersonaDTO>> findByNumeroDocumento(@RequestParam String numeroDocumento) {
        return ResponseEntity.ok(personaService.findByNumeroDocumento(numeroDocumento));
    }
    
    @GetMapping("/search/nombre")
    public ResponseEntity<List<PersonaDTO>> findByNombreOrApellido(
            @RequestParam(required = false, defaultValue = "") String nombre,
            @RequestParam(required = false, defaultValue = "") String apellido) {
        return ResponseEntity.ok(personaService.findByNombreOrApellido(nombre, apellido));
    }
    
    @GetMapping("/search/expediente/{expedienteId}")
    public ResponseEntity<List<PersonaDTO>> findByExpedienteId(@PathVariable Long expedienteId) {
        return ResponseEntity.ok(personaService.findByExpedienteId(expedienteId));
    }
} 