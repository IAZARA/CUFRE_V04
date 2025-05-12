package com.cufre.expedientes.controller;

import com.cufre.expedientes.service.EstadisticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

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

    @GetMapping("/expedientes-por-estado")
    public ResponseEntity<List<Map<String, Object>>> getExpedientesPorEstado() {
        Map<String, Long> datos = estadisticaService.countByEstadoSituacion();
        List<Map<String, Object>> resultado = datos.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", entry.getKey());
                    item.put("value", entry.getValue());
                    return item;
                })
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/expedientes-por-fuerza")
    public ResponseEntity<List<Map<String, Object>>> getExpedientesPorFuerza() {
        Map<String, Long> datos = estadisticaService.countByFuerzaAsignada();
        List<Map<String, Object>> resultado = datos.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", entry.getKey());
                    item.put("value", entry.getValue());
                    return item;
                })
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/expedientes-por-estado-y-fuerza/{fuerza}")
    public ResponseEntity<List<Map<String, Object>>> getExpedientesPorEstadoYFuerza(@PathVariable String fuerza) {
        Map<String, Long> datos = estadisticaService.countByEstadoSituacionAndFuerza(fuerza);
        List<Map<String, Object>> resultado = datos.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", entry.getKey());
                    item.put("value", entry.getValue());
                    return item;
                })
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/expedientes-por-fuerza-y-estado/{estado}")
    public ResponseEntity<List<Map<String, Object>>> getExpedientesPorFuerzaYEstado(@PathVariable String estado) {
        Map<String, Long> datos = estadisticaService.countByFuerzaAsignadaAndEstado(estado);
        List<Map<String, Object>> resultado = datos.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", entry.getKey());
                    item.put("value", entry.getValue());
                    return item;
                })
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/tipo-captura")
    public ResponseEntity<Map<String, Long>> countByTipoCaptura() {
        return ResponseEntity.ok(estadisticaService.countByTipoCaptura());
    }

    @GetMapping("/expedientes-por-tipo-captura")
    public ResponseEntity<List<Map<String, Object>>> getExpedientesPorTipoCaptura() {
        Map<String, Long> datos = estadisticaService.countByTipoCaptura();
        List<Map<String, Object>> resultado = datos.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", entry.getKey());
                    item.put("value", entry.getValue());
                    return item;
                })
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(resultado);
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