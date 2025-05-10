package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.DomicilioDTO;
import com.cufre.expedientes.model.Domicilio;
import com.cufre.expedientes.service.DomicilioService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Controlador para operaciones relacionadas con domicilios.
 */
@RestController
@RequestMapping("/domicilios")
@Slf4j
public class DomicilioController extends AbstractBaseController<Domicilio, DomicilioDTO, Long> {
    
    private final DomicilioService domicilioService;
    
    public DomicilioController(DomicilioService service) {
        super(service);
        this.domicilioService = service;
    }
    
    @PostMapping("/persona/{personaId}")
    public ResponseEntity<DomicilioDTO> createForPersona(
            @PathVariable Long personaId,
            @Valid @RequestBody DomicilioDTO domicilioDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(domicilioService.saveDomicilioForPersona(domicilioDTO, personaId));
    }
    
    @GetMapping("/persona/{personaId}")
    public ResponseEntity<List<DomicilioDTO>> findByPersonaId(@PathVariable Long personaId) {
        return ResponseEntity.ok(domicilioService.findByPersonaId(personaId));
    }
    
    @GetMapping("/search/provincia")
    public ResponseEntity<List<DomicilioDTO>> findByProvincia(@RequestParam String provincia) {
        return ResponseEntity.ok(domicilioService.findByProvincia(provincia));
    }
    
    @GetMapping("/search/localidad")
    public ResponseEntity<List<DomicilioDTO>> findByLocalidad(@RequestParam String localidad) {
        return ResponseEntity.ok(domicilioService.findByLocalidad(localidad));
    }
} 