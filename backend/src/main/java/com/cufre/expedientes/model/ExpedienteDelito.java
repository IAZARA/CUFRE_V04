package com.cufre.expedientes.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.*;

@Entity
@Table(name = "EXPEDIENTE_DELITO")
@Data
@EqualsAndHashCode(of = "id")
public class ExpedienteDelito {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EXPEDIENTE_ID", nullable = false)
    private Expediente expediente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DELITO_ID", nullable = false)
    private Delito delito;
    
    @Column(name = "OBSERVACIONES", length = 500)
    private String observaciones;
} 