package com.cufre.expedientes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonaDTO {
    
    private Long id;
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombre;
    private String apellido;
    private String alias;
    private LocalDate fechaNacimiento;
    private Integer edad;
    private String nacionalidad;
    private String genero;
    private String estadoCivil;
    
    // Relaciones
    private List<DomicilioDTO> domicilios = new ArrayList<>();
    private List<MedioComunicacionDTO> mediosComunicacion = new ArrayList<>();
    
    // Método de conveniencia
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
}
