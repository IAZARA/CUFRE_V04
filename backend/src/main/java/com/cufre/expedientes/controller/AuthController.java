package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.AuthResponseDTO;
import com.cufre.expedientes.dto.LoginDTO;
import com.cufre.expedientes.dto.UsuarioRegistroDTO;
import com.cufre.expedientes.dto.ChangePasswordDTO;
import com.cufre.expedientes.model.Usuario;
import com.cufre.expedientes.repository.UsuarioRepository;
import com.cufre.expedientes.service.AuthService;
import com.cufre.expedientes.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.security.Principal;

import jakarta.validation.Valid;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;

/**
 * Controlador para la autenticación de usuarios.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final AuthService authService;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;
    
    /**
     * Endpoint simple de prueba
     */
    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        log.info("Solicitud de prueba recibida");
        return ResponseEntity.ok("Hello World");
    }
    
    /**
     * Endpoint para autenticar usuarios y obtener un token JWT.
     *
     * @param loginDTO DTO con las credenciales de usuario
     * @return Token JWT y datos de usuario
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDTO loginDTO) {
        log.info("Solicitud de login recibida para usuario: {}", loginDTO.getEmail());
        Map<String, Object> response = authService.login(loginDTO);

        // Si la respuesta indica que se requiere activar 2FA, generar un token temporal
        if (response.containsKey("action") && "activar_2fa".equals(response.get("action"))) {
            // Agregar un token temporal para el flujo de activación de 2FA
            String tempToken = authService.generateTemp2FAToken(loginDTO.getEmail());
            response.put("temp_token", tempToken);
            log.info("Generando token temporal para activación 2FA de: {}", loginDTO.getEmail());
        }

        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para registrar nuevos usuarios
     * @param registroDTO Datos del nuevo usuario
     * @return Respuesta con datos del usuario y token JWT
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody UsuarioRegistroDTO registroDTO) {
        log.info("Solicitud de registro para: {}", registroDTO.getEmail());
        AuthResponseDTO authResponse = authService.register(registroDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto, Principal principal) {
        usuarioService.changePasswordByEmail(principal.getName(), dto.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/2fa-setup")
    public ResponseEntity<?> setup2FA(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "No autenticado", "mensaje", "Debe iniciar sesión para configurar 2FA"));
        }

        try {
            Usuario usuario = usuarioService.findByEmailEntity(principal.getName());
            GoogleAuthenticator gAuth = new GoogleAuthenticator();
            GoogleAuthenticatorKey key = gAuth.createCredentials();
            String secret = key.getKey();
            String qrUrl = GoogleAuthenticatorQRGenerator.getOtpAuthURL("CUFRE", usuario.getEmail(), key);
            usuario.setSecret2FA(secret);
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(Map.of("qrUrl", qrUrl));
        } catch (Exception e) {
            log.error("Error al configurar 2FA: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno", "mensaje", "Error al configurar 2FA: " + e.getMessage()));
        }
    }

    @PostMapping("/activar-2fa")
    public ResponseEntity<?> activar2FA(@RequestBody Map<String, String> body, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "No autenticado", "mensaje", "Debe iniciar sesión para activar 2FA"));
        }

        try {
            String code = body.get("code");
            Usuario usuario = usuarioService.findByEmailEntity(principal.getName());
            GoogleAuthenticator gAuth = new GoogleAuthenticator();
            boolean isCodeValid = gAuth.authorize(usuario.getSecret2FA(), Integer.parseInt(code));
            if (!isCodeValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Código incorrecto"));
            }
            // NO cambiamos requiere2FA a false, ya que queremos que siga requiriendo 2FA
            // en futuros inicios de sesión, solo marcamos que ya no necesita activarlo por primera vez
            usuarioRepository.save(usuario);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error al activar 2FA: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno", "mensaje", "Error al activar 2FA: " + e.getMessage()));
        }
    }

    @PostMapping("/validar-2fa")
    public ResponseEntity<?> validar2FA(@RequestBody Map<String, String> body, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "No autenticado", "mensaje", "Debe iniciar sesión para validar 2FA"));
        }

        try {
            String code = body.get("code");
            log.info("Validando código 2FA para usuario: {}", principal.getName());

            if (code == null || code.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "El código no puede estar vacío"));
            }

            // Eliminar espacios en blanco y verificar longitud
            code = code.trim();
            if (code.length() != 6) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "El código debe tener 6 dígitos"));
            }

            // Verificar que el código solo contiene dígitos
            if (!code.matches("\\d+")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "El código debe contener solo dígitos"));
            }

            Usuario usuario = usuarioService.findByEmailEntity(principal.getName());

            if (usuario.getSecret2FA() == null || usuario.getSecret2FA().trim().isEmpty()) {
                log.error("El usuario {} no tiene secret2FA configurado", principal.getName());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Error de configuración", "mensaje", "El 2FA no está correctamente configurado"));
            }

            GoogleAuthenticator gAuth = new GoogleAuthenticator();
            int codeInt;
            try {
                codeInt = Integer.parseInt(code);
            } catch (NumberFormatException e) {
                log.error("Error al convertir código a entero: {}", code);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Formato de código incorrecto", "mensaje", "El código debe contener solo dígitos"));
            }

            boolean isCodeValid = gAuth.authorize(usuario.getSecret2FA(), codeInt);
            log.info("Resultado de validación para {}: {}", principal.getName(), isCodeValid);

            if (!isCodeValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Código incorrecto"));
            }

            String jwt = authService.getTokenForUsuario(usuario);
            return ResponseEntity.ok(Map.of("token", jwt));
        } catch (Exception e) {
            log.error("Error al validar 2FA: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno", "mensaje", "Error al validar 2FA: " + e.getMessage()));
        }
    }
}