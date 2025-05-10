package com.cufre.expedientes.controller;

import com.cufre.expedientes.service.EstadisticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/estadisticas")
@RequiredArgsConstructor
public class EstadisticaController {
    private final EstadisticaService estadisticaService;
    
    @GetMapping("/provincia")
    public ResponseEntity<Map<String, Long>> countByProvincia() {
        return ResponseEntity.ok(estadisticaService.countByProvincia());
    }
    
    @GetMapping("/estado")
    public ResponseEntity<Map<String, Long>> countByEstadoSituacion() {
        return ResponseEntity.ok(estadisticaService.countByEstadoSituacion());
    }
    
    @GetMapping("/tipo-captura")
    public ResponseEntity<Map<String, Long>> countByTipoCaptura() {
        return ResponseEntity.ok(estadisticaService.countByTipoCaptura());
    }
    
    @GetMapping("/periodo")
    public ResponseEntity<Map<String, Long>> countByPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(estadisticaService.countByPeriodo(inicio, fin));
    }
    
    @GetMapping("/generales")
    public ResponseEntity<Map<String, Object>> getEstadisticasGenerales() {
        return ResponseEntity.ok(estadisticaService.getEstadisticasGenerales());
    }
    
    /**
     * Endpoint para obtener todas las estadísticas necesarias para el dashboard
     * @return Datos consolidados del dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        return ResponseEntity.ok(estadisticaService.getDashboardData());
    }
} 