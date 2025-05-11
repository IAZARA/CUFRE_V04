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
        Usuario usuario = usuarioService.findByEmailEntity(principal.getName());
        GoogleAuthenticator gAuth = new GoogleAuthenticator();
        GoogleAuthenticatorKey key = gAuth.createCredentials();
        String secret = key.getKey();
        String qrUrl = GoogleAuthenticatorQRGenerator.getOtpAuthURL("CUFRE", usuario.getEmail(), key);
        usuario.setSecret2FA(secret);
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Map.of("qrUrl", qrUrl));
    }

    @PostMapping("/activar-2fa")
    public ResponseEntity<?> activar2FA(@RequestBody Map<String, String> body, Principal principal) {
        String code = body.get("code");
        Usuario usuario = usuarioService.findByEmailEntity(principal.getName());
        GoogleAuthenticator gAuth = new GoogleAuthenticator();
        boolean isCodeValid = gAuth.authorize(usuario.getSecret2FA(), Integer.parseInt(code));
        if (!isCodeValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Código incorrecto"));
        }
        usuario.setRequiere2FA(false);
        usuarioRepository.save(usuario);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/validar-2fa")
    public ResponseEntity<?> validar2FA(@RequestBody Map<String, String> body, Principal principal) {
        String code = body.get("code");
        Usuario usuario = usuarioService.findByEmailEntity(principal.getName());
        GoogleAuthenticator gAuth = new GoogleAuthenticator();
        boolean isCodeValid = gAuth.authorize(usuario.getSecret2FA(), Integer.parseInt(code));
        if (!isCodeValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Código incorrecto"));
        }
        String jwt = authService.getTokenForUsuario(usuario);
        return ResponseEntity.ok(Map.of("token", jwt));
    }
}