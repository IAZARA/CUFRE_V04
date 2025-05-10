package com.cufre.expedientes.mapper.util;

import com.cufre.expedientes.model.enums.Rol;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

/**
 * Clase de utilidad para mapear enumerados entre entidades y DTOs.
 */
@Component
public class EnumMapper {
    
    /**
     * Convierte un Rol a su representación String
     */
    @Named("rolToString")
    public String rolToString(Rol rol) {
        return rol != null ? rol.name() : null;
    }
    
    /**
     * Convierte un String a un Rol
     */
    @Named("stringToRol")
    public Rol stringToRol(String rol) {
        try {
            return rol != null ? Rol.valueOf(rol) : null;
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
} 