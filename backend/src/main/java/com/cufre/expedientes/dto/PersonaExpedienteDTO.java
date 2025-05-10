package com.cufre.expedientes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonaExpedienteDTO {
    
    private Long id;
    private Long personaId;
    private Long expedienteId;
    private String tipoRelacion;
    private String observaciones;
    
    // Datos de la persona (para respuestas anidadas)
    private PersonaDTO persona;
} 