package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.DocumentoDTO;
import com.cufre.expedientes.model.Documento;
import com.cufre.expedientes.service.DocumentoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controlador para operaciones relacionadas con documentos.
 */
@RestController
@RequestMapping("/documentos")
@Slf4j
public class DocumentoController extends AbstractBaseController<Documento, DocumentoDTO, Long> {
    
    private final DocumentoService documentoService;
    
    public DocumentoController(DocumentoService service) {
        super(service);
        this.documentoService = service;
    }
    
    /**
     * Busca documentos por ID de expediente
     * @param expedienteId ID del expediente
     * @return Lista de documentos asociados al expediente
     */
    @GetMapping("/search/expediente/{expedienteId}")
    public ResponseEntity<List<DocumentoDTO>> findByExpedienteId(@PathVariable Long expedienteId) {
        return ResponseEntity.ok(documentoService.findByExpedienteId(expedienteId));
    }
    
    /**
     * Busca documentos por tipo
     * @param tipo Tipo de documento
     * @return Lista de documentos del tipo especificado
     */
    @GetMapping("/search/tipo")
    public ResponseEntity<List<DocumentoDTO>> findByTipo(@RequestParam String tipo) {
        return ResponseEntity.ok(documentoService.findByTipo(tipo));
    }
    
    /**
     * Busca documentos por descripción (búsqueda parcial)
     * @param descripcion Texto a buscar en la descripción
     * @return Lista de documentos cuya descripción contiene el texto buscado
     */
    @GetMapping("/search/descripcion")
    public ResponseEntity<List<DocumentoDTO>> findByDescripcion(@RequestParam String descripcion) {
        return ResponseEntity.ok(documentoService.findByDescripcion(descripcion));
    }
    
    /**
     * Busca documentos dentro de un rango de fechas
     * @param fechaInicio Fecha de inicio (inclusive)
     * @param fechaFin Fecha de fin (inclusive)
     * @return Lista de documentos dentro del rango de fechas
     */
    @GetMapping("/search/fechas")
    public ResponseEntity<List<DocumentoDTO>> findByFechasBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(documentoService.findByFechasBetween(fechaInicio, fechaFin));
    }
    
    /**
     * Busca documentos por tipo y expediente
     * @param tipo Tipo de documento
     * @param expedienteId ID del expediente
     * @return Lista de documentos del tipo y expediente especificados
     */
    @GetMapping("/search/tipo-expediente")
    public ResponseEntity<List<DocumentoDTO>> findByTipoAndExpedienteId(
            @RequestParam String tipo,
            @RequestParam Long expedienteId) {
        return ResponseEntity.ok(documentoService.findByTipoAndExpedienteId(tipo, expedienteId));
    }
} 