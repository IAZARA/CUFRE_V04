package com.cufre.expedientes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DelitoDTO {
    
    private Long id;
    private String nombre;
    private String descripcion;
    private String codigoPenal;
    private String tipoPena;
    private String penaMinima;
    private String penaMaxima;
    private Integer valoracion;
    private LocalDate creadoEn;
    private LocalDate actualizadoEn;
} 