package com.cufre.expedientes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MedioComunicacionDTO {
    
    private Long id;
    private Long personaId;
    private String tipo;
    private String valor;
    private String observaciones;
}
