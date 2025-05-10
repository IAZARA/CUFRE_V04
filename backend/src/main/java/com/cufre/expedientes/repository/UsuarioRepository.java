package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.Usuario;
import com.cufre.expedientes.model.enums.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Usuario
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    /**
     * Busca un usuario por su nombre
     * @param nombre Nombre del usuario
     * @return Usuario encontrado o vacío
     */
    Optional<Usuario> findByNombre(String nombre);
    
    /**
     * Busca usuarios por rol
     * @param rol Rol de usuario
     * @return Lista de usuarios con el rol especificado
     */
    List<Usuario> findByRol(Rol rol);
    
    /**
     * Busca un usuario por su email
     * @param email Email del usuario
     * @return Usuario encontrado o vacío
     */
    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByNombreAndApellido(String nombre, String apellido);
    
    Optional<Usuario> findByDependencia(String dependencia);
    
    @Query("SELECT u FROM Usuario u WHERE u.creadoPor.id = :usuarioId")
    List<Usuario> findUsuariosCreados(Long usuarioId);
} 