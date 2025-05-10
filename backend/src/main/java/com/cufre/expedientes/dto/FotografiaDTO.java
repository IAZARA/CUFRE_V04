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
public class FotografiaDTO {
    
    private Long id;
    private Long expedienteId;
    private String rutaArchivo;
    private String descripcion;
    private LocalDate fecha;
    private String nombreArchivo;
    private String tipoArchivo;
    private byte[] datos;
    private Long tamanio;
}
