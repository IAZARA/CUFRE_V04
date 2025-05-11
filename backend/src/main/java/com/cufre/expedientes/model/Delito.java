package com.cufre.expedientes.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "DELITO")
@Data
@EqualsAndHashCode(of = "id")
@ToString(exclude = "expedienteDelitos")
public class Delito {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "delito_seq")
    @SequenceGenerator(name = "delito_seq", sequenceName = "SEQ_DELITO", allocationSize = 1)
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "NOMBRE", nullable = false, length = 400)
    private String nombre;
    
    @Column(name = "DESCRIPCION", length = 1000)
    private String descripcion;
    
    @Column(name = "CODIGO_PENAL", length = 100)
    private String codigoPenal;
    
    @Column(name = "TIPO_PENA", length = 100)
    private String tipoPena;
    
    @Column(name = "PENA_MINIMA", length = 50)
    private String penaMinima;
    
    @Column(name = "PENA_MAXIMA", length = 200)
    private String penaMaxima;
    
    @Column(name = "VALORACION")
    private Integer valoracion;
    
    @Column(name = "CREADO_EN")
    private LocalDate creadoEn;
    
    @Column(name = "ACTUALIZADO_EN")
    private LocalDate actualizadoEn;
    
    @OneToMany(mappedBy = "delito", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExpedienteDelito> expedienteDelitos = new ArrayList<>();
    
    // Métodos de conveniencia
    public void addExpedienteDelito(ExpedienteDelito expedienteDelito) {
        expedienteDelitos.add(expedienteDelito);
        expedienteDelito.setDelito(this);
    }
    
    public void removeExpedienteDelito(ExpedienteDelito expedienteDelito) {
        expedienteDelitos.remove(expedienteDelito);
        expedienteDelito.setDelito(null);
    }
}
