package com.cufre.expedientes.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ACTIVIDAD_SISTEMA")
public class ActividadSistema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "USUARIO", nullable = false)
    private String usuario; // email o nombre del usuario que realizó la acción

    @Column(name = "TIPO_ACCION", nullable = false)
    private String tipoAccion; // Ej: LOGIN, CREAR_EXPEDIENTE, EDITAR_EXPEDIENTE, etc.

    @Column(name = "FECHA_HORA", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "DETALLES", length = 1000)
    private String detalles; // Detalles adicionales de la acción (ej: número de expediente, cambios, etc.)

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getTipoAccion() { return tipoAccion; }
    public void setTipoAccion(String tipoAccion) { this.tipoAccion = tipoAccion; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public String getDetalles() { return detalles; }
    public void setDetalles(String detalles) { this.detalles = detalles; }
} 