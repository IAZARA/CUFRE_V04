package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.AuthResponseDTO;
import com.cufre.expedientes.dto.LoginDTO;
import com.cufre.expedientes.dto.UsuarioDTO;
import com.cufre.expedientes.dto.UsuarioRegistroDTO;
import com.cufre.expedientes.exception.BadCredentialsException;
import com.cufre.expedientes.exception.ResourceNotFoundException;
import com.cufre.expedientes.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.cufre.expedientes.model.Usuario;
import com.cufre.expedientes.service.ActividadSistemaService;

/**
 * Servicio para gestionar la autenticación y registro de usuarios.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UsuarioService usuarioService;
    private final ActividadSistemaService actividadSistemaService;
    
    /**
     * Autentica a un usuario con sus credenciales
     * @param loginDTO Credenciales del usuario
     * @return Respuesta de autenticación con el token JWT
     */
    @Transactional(readOnly = true)
    public Map<String, Object> login(LoginDTO loginDTO) {
        try {
            log.debug("Iniciando proceso de autenticación para usuario: {}", loginDTO.getEmail());
            
            // Autenticar con Spring Security
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
            );
            
            // Establecer el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Buscar el usuario autenticado
            Optional<UsuarioDTO> usuarioOptional = usuarioService.findByEmail(loginDTO.getEmail());
            
            if (usuarioOptional.isEmpty()) {
                throw new ResourceNotFoundException("Usuario no encontrado con email: " + loginDTO.getEmail());
            }
            
            UsuarioDTO usuario = usuarioOptional.get();
            
            // Revisar si requiere cambio de contraseña
            if (usuario.isRequiereCambioContrasena()) {
                Map<String, Object> response = new HashMap<>();
                response.put("action", "cambiar_contrasena");
                response.put("message", "Debe cambiar su contraseña antes de continuar.");
                return response;
            }

            // Revisar si el usuario tiene configurado 2FA (tiene una clave secret2FA)
            if (usuario.getSecret2FA() != null && !usuario.getSecret2FA().isEmpty()) {
                // Ya tiene configurado 2FA, entonces debe validar siempre
                Map<String, Object> response = new HashMap<>();

                // Generamos un token temporal específico para validación 2FA
                String tempToken = generateTemp2FAToken(usuario.getEmail());
                log.info("Generando token temporal para validación 2FA de: {}", usuario.getEmail());

                response.put("action", "validar_2fa");
                response.put("message", "Debe validar su código de autenticación 2FA para continuar.");
                response.put("email", usuario.getEmail());
                response.put("temp_token", tempToken);

                return response;
            } else if (usuario.isRequiere2FA()) {
                // No tiene configurado 2FA, pero se requiere, entonces debe activarlo
                Map<String, Object> response = new HashMap<>();
                response.put("action", "activar_2fa");
                response.put("message", "Debe activar el segundo factor de autenticación (2FA) antes de continuar.");
                response.put("temp_token", generateTemp2FAToken(usuario.getEmail()));
                return response;
            }

            // Generar token JWT
            String jwt = tokenProvider.generateToken(usuario);
            
            // Crear respuesta como Map
            Map<String, Object> response = new HashMap<>();
            response.put("id", usuario.getId());
            response.put("nombre", usuario.getNombre());
            response.put("email", usuario.getEmail());
            response.put("rol", usuario.getRol());
            response.put("token", jwt);
            
            log.info("Usuario autenticado exitosamente: {}", usuario.getEmail());
            // Registrar actividad de login exitoso
            actividadSistemaService.registrarActividad(usuario.getEmail(), "LOGIN", "Inicio de sesión exitoso");
            return response;
            
        } catch (AuthenticationException e) {
            log.error("Error de autenticación: {}", e.getMessage());
            throw new BadCredentialsException("Credenciales inválidas");
        }
    }
    
    /**
     * Registra un nuevo usuario
     * @param registroDTO Datos del nuevo usuario
     * @return Respuesta de autenticación con el token JWT
     */
    @Transactional
    public AuthResponseDTO register(UsuarioRegistroDTO registroDTO) {
        // Crear el usuario
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setNombre(registroDTO.getNombre());
        usuarioDTO.setApellido(registroDTO.getApellido());
        usuarioDTO.setEmail(registroDTO.getEmail());
        usuarioDTO.setRol(registroDTO.getRol());
        
        UsuarioDTO usuarioCreado = usuarioService.create(usuarioDTO, registroDTO.getPassword());
        
        // Generar token JWT
        String jwt = tokenProvider.generateToken(usuarioCreado);
        
        // Crear respuesta
        AuthResponseDTO authResponse = new AuthResponseDTO(
            usuarioCreado.getId(),
            usuarioCreado.getNombre(),
            usuarioCreado.getEmail(),
            usuarioCreado.getRol(),
            jwt
        );
        
        log.info("Usuario registrado: {}", usuarioCreado.getEmail());
        return authResponse;
    }

    public String getTokenForUsuario(Usuario usuario) {
        return tokenProvider.generateToken(usuarioService.toDto(usuario));
    }

    /**
     * Genera un token para 2FA basado en el email del usuario.
     * Este es un token de uso específico para el flujo de activación y validación de 2FA.
     *
     * @param email Email del usuario
     * @return Token JWT temporal para flujo 2FA
     */
    public String generateTemp2FAToken(String email) {
        log.debug("Generando token temporal 2FA para: {}", email);
        Optional<UsuarioDTO> usuarioOpt = usuarioService.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            UsuarioDTO usuario = usuarioOpt.get();
            String token = tokenProvider.generateToken(usuario);
            log.debug("Token 2FA generado exitosamente para: {}", email);
            return token;
        }
        log.error("No se pudo generar token 2FA. Usuario no encontrado: {}", email);
        throw new ResourceNotFoundException("Usuario no encontrado con email: " + email);
    }
} 