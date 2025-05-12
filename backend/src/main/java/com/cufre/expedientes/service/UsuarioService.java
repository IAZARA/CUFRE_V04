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
import jakarta.mail.MessagingException;
import com.cufre.expedientes.service.ActividadSistemaService;

/**
 * Servicio para la gestión de usuarios
 */
@Service
@Slf4j
public class UsuarioService extends AbstractBaseService<Usuario, UsuarioDTO, Long, UsuarioRepository, UsuarioMapper> {

    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final ActividadSistemaService actividadSistemaService;

    public UsuarioService(UsuarioRepository repository, UsuarioMapper mapper, PasswordEncoder passwordEncoder, EmailService emailService, ActividadSistemaService actividadSistemaService) {
        super(repository, mapper);
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.actividadSistemaService = actividadSistemaService;
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
        // Registrar actividad de creación de usuario
        actividadSistemaService.registrarActividad(usuario.getEmail(), "CREAR_USUARIO", "Usuario creado: " + usuario.getNombre());
        // Enviar email de bienvenida
        try {
            emailService.enviarBienvenida(usuario.getNombre(), usuario.getApellido(), usuario.getEmail());
            log.info("Email de bienvenida enviado a {}", usuario.getEmail());
        } catch (MessagingException e) {
            log.error("No se pudo enviar el email de bienvenida a {}: {}", usuario.getEmail(), e.getMessage());
        }
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

    /**
     * Busca un usuario por email y retorna la entidad Usuario
     * @param email Email del usuario
     * @return Usuario encontrado o excepción
     */
    @Transactional(readOnly = true)
    public Usuario findByEmailEntity(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
    }

    /**
     * Cambia la contraseña de un usuario por email
     * @param email Email del usuario
     * @param newPassword Nueva contraseña
     */
    @Transactional
    public void changePasswordByEmail(String email, String newPassword) {
        Usuario usuario = findByEmailEntity(email);
        usuario.setContrasena(passwordEncoder.encode(newPassword));
        usuario.setRequiereCambioContrasena(false);
        repository.save(usuario);
        log.info("Contraseña cambiada para usuario con email: {}", email);
    }

    /**
     * Resetea la contraseña y el 2FA de un usuario (para uso administrativo)
     * @param id ID del usuario
     */
    @Transactional
    public void resetPasswordAnd2FA(Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        usuario.setContrasena(passwordEncoder.encode("Minseg2025-"));
        usuario.setRequiereCambioContrasena(true);
        usuario.setRequiere2FA(true);
        usuario.setSecret2FA(null);
        repository.save(usuario);
        log.info("Contraseña y 2FA reseteados para usuario con ID: {}", id);
    }
} 