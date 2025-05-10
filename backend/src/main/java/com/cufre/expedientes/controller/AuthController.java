package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.AuthResponseDTO;
import com.cufre.expedientes.dto.LoginDTO;
import com.cufre.expedientes.dto.UsuarioRegistroDTO;
import com.cufre.expedientes.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import jakarta.validation.Valid;

/**
 * Controlador para la autenticación de usuarios.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final AuthService authService;
    
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
}