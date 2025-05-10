package com.cufre.expedientes.dto;

import com.cufre.expedientes.model.enums.Rol;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta de autenticación con JWT token
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private Rol rol;
    private String token;
} 