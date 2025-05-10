package com.cufre.expedientes.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import jakarta.persistence.*;

@Entity
@Table(name = "MEDIOS_DE_COMUNICACION")
@Data
@EqualsAndHashCode(of = "id")
@ToString(exclude = "persona")
public class MedioComunicacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PERSONA_ID", nullable = false)
    private Persona persona;
    
    @Column(name = "TIPO", length = 20)
    private String tipo;
    
    @Column(name = "VALOR", length = 100)
    private String valor;
    
    @Column(name = "OBSERVACIONES", length = 200)
    private String observaciones;
}
