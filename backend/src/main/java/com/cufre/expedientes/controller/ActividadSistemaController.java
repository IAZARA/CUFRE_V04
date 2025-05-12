package com.cufre.expedientes.controller;

import com.cufre.expedientes.model.ActividadSistema;
import com.cufre.expedientes.service.ActividadSistemaService;
import com.cufre.expedientes.model.Usuario;
import com.cufre.expedientes.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/actividad-sistema")
public class ActividadSistemaController {
    @Autowired
    private ActividadSistemaService actividadSistemaService;

    /**
     * Devuelve la lista de actividad del sistema (auditoría).
     * Solo accesible para ADMINISTRADOR y SUPERUSUARIO.
     */
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERUSUARIO')")
    @GetMapping
    public ResponseEntity<List<ActividadSistema>> obtenerActividad() {
        List<ActividadSistema> actividades = actividadSistemaService.obtenerTodas();
        return ResponseEntity.ok(actividades);
    }
} 