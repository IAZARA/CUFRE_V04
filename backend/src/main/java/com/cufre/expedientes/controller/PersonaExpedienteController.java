package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.PersonaExpedienteDTO;
import com.cufre.expedientes.model.PersonaExpediente;
import com.cufre.expedientes.service.PersonaExpedienteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para operaciones relacionadas con las relaciones entre personas y expedientes.
 */
@RestController
@RequestMapping("/persona-expedientes")
@Slf4j
public class PersonaExpedienteController extends AbstractBaseController<PersonaExpediente, PersonaExpedienteDTO, Long> {
    
    private final PersonaExpedienteService personaExpedienteService;
    
    public PersonaExpedienteController(PersonaExpedienteService service) {
        super(service);
        this.personaExpedienteService = service;
    }
    
    /**
     * Busca relaciones por ID de expediente
     * @param expedienteId ID del expediente
     * @return Lista de relaciones con el expediente especificado
     */
    @GetMapping("/search/expediente/{expedienteId}")
    public ResponseEntity<List<PersonaExpedienteDTO>> findByExpedienteId(@PathVariable Long expedienteId) {
        return ResponseEntity.ok(personaExpedienteService.findByExpedienteId(expedienteId));
    }
    
    /**
     * Busca relaciones por ID de persona
     * @param personaId ID de la persona
     * @return Lista de relaciones con la persona especificada
     */
    @GetMapping("/search/persona/{personaId}")
    public ResponseEntity<List<PersonaExpedienteDTO>> findByPersonaId(@PathVariable Long personaId) {
        return ResponseEntity.ok(personaExpedienteService.findByPersonaId(personaId));
    }
    
    /**
     * Busca relaciones por rol de persona
     * @param rol Rol de la persona en el expediente
     * @return Lista de relaciones con el rol especificado
     */
    @GetMapping("/search/rol")
    public ResponseEntity<List<PersonaExpedienteDTO>> findByRol(@RequestParam String rol) {
        return ResponseEntity.ok(personaExpedienteService.findByRol(rol));
    }
} 