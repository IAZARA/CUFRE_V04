package com.cufre.expedientes.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.*;

@Entity
@Table(name = "PERSONA_EXPEDIENTE")
@Data
@EqualsAndHashCode(of = "id")
public class PersonaExpediente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PERSONA_ID", nullable = false)
    private Persona persona;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EXPEDIENTE_ID", nullable = false)
    private Expediente expediente;
    
    @Column(name = "TIPO_RELACION", nullable = false, length = 50)
    private String tipoRelacion;
    
    @Column(name = "OBSERVACIONES", length = 500)
    private String observaciones;
} 