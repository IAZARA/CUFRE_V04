package com.cufre.expedientes.service;

import com.cufre.expedientes.repository.ExpedienteRepository;
import com.cufre.expedientes.repository.UsuarioRepository;
import com.cufre.expedientes.repository.PersonaRepository;
import com.cufre.expedientes.repository.DelitoRepository;
import com.cufre.expedientes.repository.PersonaExpedienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EstadisticaService {
    private final ExpedienteRepository expedienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final DelitoRepository delitoRepository;
    private final PersonaExpedienteRepository personaExpedienteRepository;
    
    /**
     * Obtiene la cantidad de expedientes por provincia
     */
    public Map<String, Long> countByProvincia() {
        List<Object[]> results = expedienteRepository.countByProvincia();
        Map<String, Long> estadisticas = new HashMap<>();
        
        for (Object[] result : results) {
            String provincia = (String) result[0];
            Long count = (Long) result[1];
            estadisticas.put(provincia != null ? provincia : "Sin datos", count);
        }
        
        return estadisticas;
    }
    
    /**
     * Obtiene la cantidad de expedientes por estado de situación
     */
    public Map<String, Long> countByEstadoSituacion() {
        List<Object[]> results = expedienteRepository.countByEstadoSituacion();
        Map<String, Long> estadisticas = new HashMap<>();
        
        for (Object[] result : results) {
            String estado = (String) result[0];
            Long count = (Long) result[1];
            estadisticas.put(estado != null ? estado : "Sin datos", count);
        }
        
        return estadisticas;
    }
    
    /**
     * Obtiene la cantidad de expedientes por tipo de captura
     */
    public Map<String, Long> countByTipoCaptura() {
        List<Object[]> results = expedienteRepository.countByTipoCaptura();
        Map<String, Long> estadisticas = new HashMap<>();
        
        for (Object[] result : results) {
            String tipoCaptura = (String) result[0];
            Long count = (Long) result[1];
            estadisticas.put(tipoCaptura != null ? tipoCaptura : "Sin datos", count);
        }
        
        return estadisticas;
    }
    
    /**
     * Obtiene la cantidad de expedientes por rango de fechas
     */
    public Map<String, Long> countByPeriodo(LocalDate inicio, LocalDate fin) {
        Map<String, Long> estadisticas = new HashMap<>();
        estadisticas.put("total", expedienteRepository.countByPeriodo(inicio, fin));
        return estadisticas;
    }
    
    /**
     * Obtiene un resumen general de todas las estadísticas
     */
    public Map<String, Object> getEstadisticasGenerales() {
        Map<String, Object> estadisticas = new HashMap<>();
        
        estadisticas.put("totalExpedientes", expedienteRepository.count());
        estadisticas.put("porProvincia", countByProvincia());
        estadisticas.put("porEstado", countByEstadoSituacion());
        estadisticas.put("porTipoCaptura", countByTipoCaptura());
        
        return estadisticas;
    }
    
    /**
     * Obtiene datos consolidados para el dashboard
     * @return Map con estadísticas para el dashboard
     */
    public Map<String, Object> getDashboardData() {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Total de expedientes
        dashboardData.put("totalExpedientes", expedienteRepository.count());
        
        // Total de usuarios
        dashboardData.put("totalUsuarios", usuarioRepository.count());
        
        // Total de personas vinculadas a expedientes
        dashboardData.put("totalPersonas", personaExpedienteRepository.countDistinctPersonasVinculadas());
        
        // Total de delitos
        dashboardData.put("totalDelitos", delitoRepository.count());
        
        // Expedientes por provincia
        dashboardData.put("expedientesPorProvincia", countByProvincia());
        
        // Expedientes por estado
        dashboardData.put("expedientesPorEstado", countByEstadoSituacion());
        
        // Expedientes por tipo de captura
        dashboardData.put("expedientesPorTipoCaptura", countByTipoCaptura());
        
        // Expedientes recientes (último mes)
        LocalDate hoy = LocalDate.now();
        LocalDate mesAnterior = hoy.minusMonths(1);
        dashboardData.put("expedientesRecientes", expedienteRepository.countByPeriodo(mesAnterior, hoy));
        
        // Lista de datos formateados para las tarjetas del dashboard
        List<Map<String, Object>> stats = new java.util.ArrayList<>();
        
        Map<String, Object> totalStats = new HashMap<>();
        totalStats.put("title", "Total Expedientes");
        totalStats.put("value", expedienteRepository.count());
        totalStats.put("icon", "folder");
        totalStats.put("color", "primary");
        stats.add(totalStats);
        
        Map<String, Object> recentStats = new HashMap<>();
        recentStats.put("title", "Expedientes Recientes");
        recentStats.put("value", expedienteRepository.countByPeriodo(mesAnterior, hoy));
        recentStats.put("icon", "recent");
        recentStats.put("color", "success");
        stats.add(recentStats);
        
        Map<String, Object> pendingStats = new HashMap<>();
        pendingStats.put("title", "En Proceso");
        Long pendientes = expedienteRepository.countByEstadoSituacionEquals("EN PROCESO");
        pendingStats.put("value", pendientes != null ? pendientes : 0);
        pendingStats.put("icon", "pending");
        pendingStats.put("color", "warning");
        stats.add(pendingStats);
        
        Map<String, Object> completedStats = new HashMap<>();
        completedStats.put("title", "Completados");
        Long completados = expedienteRepository.countByEstadoSituacionEquals("COMPLETADO");
        completedStats.put("value", completados != null ? completados : 0);
        completedStats.put("icon", "done");
        completedStats.put("color", "info");
        stats.add(completedStats);
        
        dashboardData.put("stats", stats);
        
        return dashboardData;
    }
} 