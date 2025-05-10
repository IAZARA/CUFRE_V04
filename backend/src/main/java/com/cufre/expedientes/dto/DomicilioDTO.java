package com.cufre.expedientes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DomicilioDTO {
    
    private Long id;
    private Long personaId;
    private String calle;
    private String numero;
    private String piso;
    private String departamento;
    private String barrio;
    private String codigoPostal;
    private String localidad;
    private String provincia;
    private String pais;
    private String tipo;
    private Boolean esPrincipal;
    private String descripcion;
    
    // Método de conveniencia para generar la dirección completa
    public String getDireccionCompleta() {
        StringBuilder sb = new StringBuilder();
        sb.append(calle).append(" ").append(numero);
        
        if (piso != null && !piso.isEmpty()) {
            sb.append(", Piso ").append(piso);
            
            if (departamento != null && !departamento.isEmpty()) {
                sb.append(", Dpto. ").append(departamento);
            }
        }
        
        if (barrio != null && !barrio.isEmpty()) {
            sb.append(", ").append(barrio);
        }
        
        sb.append(", ").append(localidad);
        sb.append(", ").append(provincia);
        
        if (!"Argentina".equalsIgnoreCase(pais)) {
            sb.append(", ").append(pais);
        }
        
        return sb.toString();
    }
}
