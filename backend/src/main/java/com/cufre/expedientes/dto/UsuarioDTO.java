package com.cufre.expedientes.dto;

import com.cufre.expedientes.model.enums.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO {
    
    private Long id;
    private Rol rol;
    private String nombre;
    private String apellido;
    private String email;
    private String dependencia;
    private Long creadoPorId;
    
    // Solo se usa internamente para la autenticación, no se incluye en respuestas JSON
    private String contrasena;
    
    // Método de conveniencia
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
} 