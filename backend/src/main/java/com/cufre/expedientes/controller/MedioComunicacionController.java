package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.MedioComunicacionDTO;
import com.cufre.expedientes.model.MedioComunicacion;
import com.cufre.expedientes.service.MedioComunicacionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Controlador para operaciones relacionadas con medios de comunicación.
 */
@RestController
@RequestMapping("/medios-comunicacion")
@Slf4j
public class MedioComunicacionController extends AbstractBaseController<MedioComunicacion, MedioComunicacionDTO, Long> {
    
    private final MedioComunicacionService medioComunicacionService;
    
    public MedioComunicacionController(MedioComunicacionService service) {
        super(service);
        this.medioComunicacionService = service;
    }
    
    @PostMapping("/persona/{personaId}")
    public ResponseEntity<MedioComunicacionDTO> createForPersona(
            @PathVariable Long personaId,
            @Valid @RequestBody MedioComunicacionDTO medioComunicacionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medioComunicacionService.saveMedioComunicacionForPersona(medioComunicacionDTO, personaId));
    }
    
    @GetMapping("/persona/{personaId}")
    public ResponseEntity<List<MedioComunicacionDTO>> findByPersonaId(@PathVariable Long personaId) {
        return ResponseEntity.ok(medioComunicacionService.findByPersonaId(personaId));
    }
    
    @GetMapping("/search/tipo")
    public ResponseEntity<List<MedioComunicacionDTO>> findByTipo(@RequestParam String tipo) {
        return ResponseEntity.ok(medioComunicacionService.findByTipo(tipo));
    }
    
    @GetMapping("/search/valor")
    public ResponseEntity<List<MedioComunicacionDTO>> findByValorContaining(@RequestParam String valor) {
        return ResponseEntity.ok(medioComunicacionService.findByValorContaining(valor));
    }
} 