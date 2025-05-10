package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.UsuarioDTO;
import com.cufre.expedientes.exception.ResourceNotFoundException;
import com.cufre.expedientes.mapper.UsuarioMapper;
import com.cufre.expedientes.model.Usuario;
import com.cufre.expedientes.model.enums.Rol;
import com.cufre.expedientes.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de usuarios
 */
@Service
@Slf4j
public class UsuarioService extends AbstractBaseService<Usuario, UsuarioDTO, Long, UsuarioRepository, UsuarioMapper> {

    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, UsuarioMapper mapper, PasswordEncoder passwordEncoder) {
        super(repository, mapper);
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected UsuarioDTO toDto(Usuario entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected Usuario toEntity(UsuarioDTO dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected Usuario updateEntity(UsuarioDTO dto, Usuario entity) {
        return mapper.updateEntity(dto, entity);
    }

    @Override
    protected String getEntityName() {
        return "Usuario";
    }

    /**
     * Crea un nuevo usuario
     * @param usuarioDTO Datos del usuario
     * @param password Contraseña en texto plano
     * @return Usuario creado
     */
    @Transactional
    public UsuarioDTO create(UsuarioDTO usuarioDTO, String password) {
        Usuario usuario = toEntity(usuarioDTO);
        usuario.setContrasena(passwordEncoder.encode(password));
        usuario = repository.save(usuario);
        log.info("Usuario creado: {}", usuario.getNombre());
        return toDto(usuario);
    }

    /**
     * Cambia la contraseña de un usuario
     * @param id ID del usuario
     * @param newPassword Nueva contraseña
     */
    @Transactional
    public void changePassword(Long id, String newPassword) {
        repository.findById(id)
                .map(usuario -> {
                    usuario.setContrasena(passwordEncoder.encode(newPassword));
                    return repository.save(usuario);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        log.info("Contraseña cambiada para usuario con ID: {}", id);
    }

    /**
     * Busca usuarios por rol
     * @param rol Rol de usuario
     * @return Lista de usuarios con el rol especificado
     */
    @Transactional(readOnly = true)
    public List<UsuarioDTO> findByRol(Rol rol) {
        return repository.findByRol(rol).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Busca un usuario por nombre de usuario
     * @param nombre Nombre del usuario
     * @return Usuario encontrado o vacío
     */
    @Transactional(readOnly = true)
    public Optional<UsuarioDTO> findByNombre(String nombre) {
        return repository.findByNombre(nombre)
                .map(this::toDto);
    }

    /**
     * Busca un usuario por email
     * @param email Email del usuario
     * @return Usuario encontrado o vacío
     */
    @Transactional(readOnly = true)
    public Optional<UsuarioDTO> findByEmail(String email) {
        return repository.findByEmail(email)
                .map(this::toDto);
    }
} 