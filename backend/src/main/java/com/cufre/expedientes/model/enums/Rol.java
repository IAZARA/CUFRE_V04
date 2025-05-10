package com.cufre.expedientes.model.enums;

/**
 * Enumerado que define los roles disponibles en el sistema.
 */
public enum Rol {
    SUPERUSUARIO,
    ADMINISTRADOR,
    USUARIOCARGA,
    USUARIOCONSULTA;
    
    /**
     * Convierte el nombre del rol a formato presentable
     */
    public String getNombrePresentable() {
        switch (this) {
            case SUPERUSUARIO:
                return "Super Usuario";
            case ADMINISTRADOR:
                return "Administrador";
            case USUARIOCARGA:
                return "Usuario de Carga";
            case USUARIOCONSULTA:
                return "Usuario de Consulta";
            default:
                return name();
        }
    }
} 