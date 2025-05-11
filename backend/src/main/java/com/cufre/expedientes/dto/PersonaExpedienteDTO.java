package com.cufre.expedientes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import com.cufre.expedientes.dto.MedioComunicacionDTO;
import java.util.ArrayList;

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

    // Lista de domicilios asociados a la persona
    private List<DomicilioDTO> domicilios;
    // Lista de medios de comunicación asociados a la persona
    private List<MedioComunicacionDTO> mediosComunicacion = new ArrayList<>();
} 