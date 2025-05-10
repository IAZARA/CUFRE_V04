package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.ExpedienteDelitoDTO;
import com.cufre.expedientes.model.ExpedienteDelito;
import com.cufre.expedientes.service.ExpedienteDelitoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para operaciones relacionadas con las relaciones entre expedientes y delitos.
 */
@RestController
@RequestMapping("/expediente-delitos")
@Slf4j
public class ExpedienteDelitoController extends AbstractBaseController<ExpedienteDelito, ExpedienteDelitoDTO, Long> {
    
    private final ExpedienteDelitoService expedienteDelitoService;
    
    public ExpedienteDelitoController(ExpedienteDelitoService service) {
        super(service);
        this.expedienteDelitoService = service;
    }
    
    /**
     * Busca relaciones por ID de expediente
     * @param expedienteId ID del expediente
     * @return Lista de relaciones con el expediente especificado
     */
    @GetMapping("/search/expediente/{expedienteId}")
    public ResponseEntity<List<ExpedienteDelitoDTO>> findByExpedienteId(@PathVariable Long expedienteId) {
        return ResponseEntity.ok(expedienteDelitoService.findByExpedienteId(expedienteId));
    }
    
    /**
     * Busca relaciones por ID de delito
     * @param delitoId ID del delito
     * @return Lista de relaciones con el delito especificado
     */
    @GetMapping("/search/delito/{delitoId}")
    public ResponseEntity<List<ExpedienteDelitoDTO>> findByDelitoId(@PathVariable Long delitoId) {
        return ResponseEntity.ok(expedienteDelitoService.findByDelitoId(delitoId));
    }
} 