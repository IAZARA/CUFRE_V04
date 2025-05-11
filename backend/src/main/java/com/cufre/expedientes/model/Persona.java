package com.cufre.expedientes.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "PERSONA")
@Data
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"domicilios", "mediosComunicacion", "personaExpedientes"})
public class Persona {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "TIPO_DOCUMENTO", length = 20)
    private String tipoDocumento;
    
    @Column(name = "NUMERO_DOCUMENTO", length = 20)
    private String numeroDocumento;
    
    @Column(name = "NOMBRE", length = 100)
    private String nombre;
    
    @Column(name = "APELLIDO", length = 100)
    private String apellido;
    
    @Column(name = "ALIAS", length = 100)
    private String alias;
    
    @Column(name = "FECHA_NACIMIENTO")
    private LocalDate fechaNacimiento;
    
    @Column(name = "EDAD")
    private Integer edad;
    
    @Column(name = "NACIONALIDAD", length = 50)
    private String nacionalidad;
    
    @Column(name = "GENERO", length = 20)
    private String genero;
    
    @Column(name = "ESTADO_CIVIL", length = 20)
    private String estadoCivil;
    
    @OneToMany(mappedBy = "persona", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Domicilio> domicilios = new HashSet<>();
    
    @OneToMany(mappedBy = "persona", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MedioComunicacion> mediosComunicacion = new HashSet<>();
    
    @OneToMany(mappedBy = "persona", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PersonaExpediente> personaExpedientes = new HashSet<>();
    
    // Métodos de conveniencia
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
    
    public void addDomicilio(Domicilio domicilio) {
        domicilios.add(domicilio);
        domicilio.setPersona(this);
    }
    
    public void removeDomicilio(Domicilio domicilio) {
        domicilios.remove(domicilio);
        domicilio.setPersona(null);
    }
    
    public void addMedioComunicacion(MedioComunicacion medioComunicacion) {
        mediosComunicacion.add(medioComunicacion);
        medioComunicacion.setPersona(this);
    }
    
    public void removeMedioComunicacion(MedioComunicacion medioComunicacion) {
        mediosComunicacion.remove(medioComunicacion);
        medioComunicacion.setPersona(null);
    }
    
    public void addPersonaExpediente(PersonaExpediente personaExpediente) {
        personaExpedientes.add(personaExpediente);
        personaExpediente.setPersona(this);
    }
    
    public void removePersonaExpediente(PersonaExpediente personaExpediente) {
        personaExpedientes.remove(personaExpediente);
        personaExpediente.setPersona(null);
    }
}
