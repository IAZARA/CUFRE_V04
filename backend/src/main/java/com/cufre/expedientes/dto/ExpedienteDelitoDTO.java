package com.cufre.expedientes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExpedienteDelitoDTO {
    
    private Long id;
    private Long expedienteId;
    private Long delitoId;
    private String observaciones;
    
    // Datos del delito (para respuestas anidadas)
    private DelitoDTO delito;
} 