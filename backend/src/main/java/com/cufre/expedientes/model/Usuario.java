package com.cufre.expedientes.model;

import com.cufre.expedientes.model.enums.Rol;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "USUARIO")
@Data
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"creadoPor", "usuariosCreados"})
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ROL", nullable = false, length = 50)
    private Rol rol;
    
    @Column(name = "NOMBRE", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "APELLIDO", nullable = false, length = 100)
    private String apellido;
    
    @Column(name = "EMAIL", nullable = false, length = 150, unique = true)
    private String email;
    
    @Column(name = "CONTRASENA", nullable = false, length = 200)
    private String contrasena;
    
    @Column(name = "DEPENDENCIA", length = 100)
    private String dependencia;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CREADO_POR")
    private Usuario creadoPor;
    
    @OneToMany(mappedBy = "creadoPor")
    private List<Usuario> usuariosCreados;
    
    // Métodos de conveniencia
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
}
