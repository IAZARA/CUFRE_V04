package com.cufre.expedientes.service;

import com.cufre.expedientes.model.ActividadSistema;
import com.cufre.expedientes.repository.ActividadSistemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActividadSistemaService {
    @Autowired
    private ActividadSistemaRepository actividadSistemaRepository;

    /**
     * Registra una nueva actividad en el sistema.
     * @param usuario Usuario que realiza la acción (email o nombre)
     * @param tipoAccion Tipo de acción (LOGIN, CREAR_EXPEDIENTE, etc.)
     * @param detalles Detalles adicionales (opcional)
     */
    public void registrarActividad(String usuario, String tipoAccion, String detalles) {
        ActividadSistema actividad = new ActividadSistema();
        actividad.setUsuario(usuario);
        actividad.setTipoAccion(tipoAccion);
        actividad.setFechaHora(LocalDateTime.now());
        actividad.setDetalles(detalles);
        actividadSistemaRepository.save(actividad);
    }

    /**
     * Obtiene todas las actividades (en el futuro: paginado y filtrado)
     */
    public List<ActividadSistema> obtenerTodas() {
        return actividadSistemaRepository.findAll();
    }
} 