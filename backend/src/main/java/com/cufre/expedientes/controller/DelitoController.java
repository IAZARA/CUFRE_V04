package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.DelitoDTO;
import com.cufre.expedientes.model.Delito;
import com.cufre.expedientes.service.DelitoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para operaciones relacionadas con delitos.
 */
@RestController
@RequestMapping("/delitos")
@Slf4j
public class DelitoController extends AbstractBaseController<Delito, DelitoDTO, Long> {
    
    private final DelitoService delitoService;
    
    public DelitoController(DelitoService service) {
        super(service);
        this.delitoService = service;
    }
    
    @GetMapping("/search/nombre")
    public ResponseEntity<List<DelitoDTO>> findByNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(delitoService.findByNombre(nombre));
    }
    
    @GetMapping("/search/codigoCP")
    public ResponseEntity<List<DelitoDTO>> findByCodigoCP(@RequestParam String codigoCP) {
        return ResponseEntity.ok(delitoService.findByCodigoCP(codigoCP));
    }
    
    @GetMapping("/search/expediente/{expedienteId}")
    public ResponseEntity<List<DelitoDTO>> findByExpedienteId(@PathVariable Long expedienteId) {
        return ResponseEntity.ok(delitoService.findByExpedienteId(expedienteId));
    }
} 