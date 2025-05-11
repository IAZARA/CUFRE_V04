package com.cufre.expedientes.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import jakarta.persistence.*;

@Entity
@Table(name = "DOMICILIO")
@Data
@EqualsAndHashCode(of = "id")
@ToString(exclude = "persona")
public class Domicilio {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "domicilio_seq")
    @SequenceGenerator(name = "domicilio_seq", sequenceName = "DOMICILIO_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PERSONA_ID")
    private Persona persona;
    
    @Column(name = "CALLE", length = 100)
    private String calle;
    
    @Column(name = "NUMERO", length = 20)
    private String numero;
    
    @Column(name = "PISO", length = 10)
    private String piso;
    
    @Column(name = "DEPARTAMENTO", length = 10)
    private String departamento;
    
    @Column(name = "BARRIO", length = 50)
    private String barrio;
    
    @Column(name = "CODIGO_POSTAL", length = 20)
    private String codigoPostal;
    
    @Column(name = "LOCALIDAD", length = 100)
    private String localidad;
    
    @Column(name = "PROVINCIA", length = 100)
    private String provincia;
    
    @Column(name = "PAIS", length = 100)
    private String pais;
    
    @Column(name = "TIPO", length = 20)
    private String tipo;
    
    @Column(name = "ES_PRINCIPAL")
    private Boolean esPrincipal;
    
    @Column(name = "DESCRIPCION", length = 200)
    private String descripcion;
    
    // Método de conveniencia para obtener dirección completa
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
