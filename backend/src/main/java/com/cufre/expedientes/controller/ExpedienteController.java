package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.ExpedienteDTO;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.service.ExpedienteService;
import com.cufre.expedientes.service.FotografiaService;
import com.cufre.expedientes.dto.PersonaExpedienteDTO;
import com.cufre.expedientes.service.PersonaExpedienteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Controlador para operaciones relacionadas con expedientes.
 */
@RestController
@RequestMapping("/expedientes")
@Slf4j
public class ExpedienteController extends AbstractBaseController<Expediente, ExpedienteDTO, Long> {
    
    private final ExpedienteService expedienteService;
    private final FotografiaService fotografiaService;
    private final PersonaExpedienteService personaExpedienteService;
    
    public ExpedienteController(ExpedienteService service, FotografiaService fotografiaService, PersonaExpedienteService personaExpedienteService) {
        super(service);
        this.expedienteService = service;
        this.fotografiaService = fotografiaService;
        this.personaExpedienteService = personaExpedienteService;
    }
    
    @GetMapping("/search/fechas")
    public ResponseEntity<List<ExpedienteDTO>> findByFechasIngreso(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(expedienteService.findByFechaIngresoBetween(fechaInicio, fechaFin));
    }
    
    @GetMapping("/search/numero")
    public ResponseEntity<List<ExpedienteDTO>> findByNumeroExpediente(@RequestParam String numero) {
        return ResponseEntity.ok(expedienteService.findByNumeroExpediente(numero));
    }
    
    @GetMapping("/search/persona/{personaId}")
    public ResponseEntity<List<ExpedienteDTO>> findByPersonaId(@PathVariable Long personaId) {
        return ResponseEntity.ok(expedienteService.findByPersonaId(personaId));
    }
    
    @GetMapping("/search/delito/{delitoId}")
    public ResponseEntity<List<ExpedienteDTO>> findByDelitoId(@PathVariable Long delitoId) {
        return ResponseEntity.ok(expedienteService.findByDelitoId(delitoId));
    }
    
    @GetMapping("/estadisticas/provincia")
    public ResponseEntity<Map<String, Long>> getEstadisticasPorProvincia() {
        return ResponseEntity.ok(expedienteService.getEstadisticasPorProvincia());
    }
    
    @GetMapping("/estadisticas/periodo")
    public ResponseEntity<Long> getEstadisticasPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(expedienteService.getEstadisticasPorPeriodo(fechaInicio, fechaFin));
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ExpedienteDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(expedienteService.findByIdComplete(id));
    }
    
    /**
     * Obtiene todos los delitos asociados a un expediente
     * @param id ID del expediente
     * @return Lista de delitos asociados
     */
    @GetMapping("/{id}/delitos")
    public ResponseEntity<List<com.cufre.expedientes.dto.DelitoDTO>> getDelitos(@PathVariable Long id) {
        return ResponseEntity.ok(expedienteService.findDelitosByExpedienteId(id));
    }
    
    /**
     * Obtiene todas las fotografías asociadas a un expediente
     * @param id ID del expediente
     * @return Lista de fotografías asociadas
     */
    @GetMapping("/{id}/fotografias")
    public ResponseEntity<List<com.cufre.expedientes.dto.FotografiaDTO>> getFotografias(@PathVariable Long id) {
        log.info("Obteniendo fotografías para expediente ID: {}", id);
        return ResponseEntity.ok(expedienteService.findFotografiasByExpedienteId(id));
    }
    
    /**
     * Obtiene todos los documentos asociados a un expediente
     * @param id ID del expediente
     * @return Lista de documentos asociados
     */
    @GetMapping("/{id}/documentos")
    public ResponseEntity<List<com.cufre.expedientes.dto.DocumentoDTO>> getDocumentos(@PathVariable Long id) {
        log.info("Obteniendo documentos para expediente ID: {}", id);
        return ResponseEntity.ok(expedienteService.findDocumentosByExpedienteId(id));
    }
    
    /**
     * Obtiene todas las personas asociadas a un expediente
     * @param id ID del expediente
     * @return Lista de relaciones persona-expediente
     */
    @GetMapping("/{id}/personas")
    public ResponseEntity<List<com.cufre.expedientes.dto.PersonaExpedienteDTO>> getPersonas(@PathVariable Long id) {
        log.info("Obteniendo personas para expediente ID: {}", id);
        return ResponseEntity.ok(expedienteService.findPersonasByExpedienteId(id));
    }
    
    /**
     * Asocia un delito a un expediente
     * @param id ID del expediente
     * @param expedienteDelitoDTO Información de la relación
     * @return Relación creada
     */
    @PostMapping("/{id}/delitos")
    public ResponseEntity<com.cufre.expedientes.dto.ExpedienteDelitoDTO> addDelito(
            @PathVariable Long id, 
            @RequestBody com.cufre.expedientes.dto.ExpedienteDelitoDTO expedienteDelitoDTO) {
        // Asegurar que el ID del expediente en el DTO coincida con el de la URL
        expedienteDelitoDTO.setExpedienteId(id);
        return ResponseEntity.ok(expedienteService.addDelito(expedienteDelitoDTO));
    }
    
    /**
     * Elimina un delito de un expediente
     * @param id ID del expediente
     * @param delitoId ID del delito
     * @return Respuesta vacía con status OK
     */
    @DeleteMapping("/{id}/delitos/{delitoId}")
    public ResponseEntity<Void> removeDelito(@PathVariable Long id, @PathVariable Long delitoId) {
        expedienteService.removeDelito(id, delitoId);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Elimina una fotografía de un expediente
     * @param id ID del expediente
     * @param fotografiaId ID de la fotografía
     * @return Respuesta vacía con status OK
     */
    @DeleteMapping("/{id}/fotografias/{fotografiaId}")
    public ResponseEntity<Void> eliminarFotografia(@PathVariable Long id, @PathVariable Long fotografiaId) {
        fotografiaService.eliminarFotografiaDeExpediente(id, fotografiaId);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Asocia una persona a un expediente
     * @param id ID del expediente
     * @param dto Información de la relación persona-expediente
     * @return Relación creada
     */
    @PostMapping("/{id}/personas")
    public ResponseEntity<PersonaExpedienteDTO> addPersona(@PathVariable Long id, @RequestBody PersonaExpedienteDTO dto) {
        dto.setExpedienteId(id);
        PersonaExpedienteDTO saved = personaExpedienteService.savePersonaExpediente(dto);
        return ResponseEntity.ok(saved);
    }
    
    /**
     * Actualiza la foto principal de un expediente
     */
    @PutMapping("/{id}/foto-principal/{fotoId}")
    public ResponseEntity<Void> setFotoPrincipal(@PathVariable Long id, @PathVariable Long fotoId) {
        expedienteService.setFotoPrincipal(id, fotoId);
        return ResponseEntity.ok().build();
    }
} 