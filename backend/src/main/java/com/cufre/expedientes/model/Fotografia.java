package com.cufre.expedientes.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "FOTOGRAFIA")
@Data
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"expediente", "datos"})
public class Fotografia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EXPEDIENTE_ID", nullable = false)
    private Expediente expediente;
    
    @Column(name = "RUTA_ARCHIVO", length = 200)
    private String rutaArchivo;
    
    @Column(name = "DESCRIPCION", length = 200)
    private String descripcion;
    
    @Column(name = "FECHA")
    private LocalDate fecha;
    
    @Column(name = "NOMBRE_ARCHIVO", length = 200)
    private String nombreArchivo;
    
    @Column(name = "TIPO_ARCHIVO", length = 100)
    private String tipoArchivo;
    
    @Lob
    @Column(name = "DATOS")
    private byte[] datos;
    
    @Column(name = "TAMANIO")
    private Long tamanio;
}
