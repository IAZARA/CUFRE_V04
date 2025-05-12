package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.CambioPasswordDTO;
import com.cufre.expedientes.dto.UsuarioDTO;
import com.cufre.expedientes.model.Usuario;
import com.cufre.expedientes.model.enums.Rol;
import com.cufre.expedientes.service.UsuarioService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Controlador para operaciones relacionadas con usuarios.
 */
@RestController
@RequestMapping("/usuarios")
@Slf4j
public class UsuarioController extends AbstractBaseController<Usuario, UsuarioDTO, Long> {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService service) {
        super(service);
        this.usuarioService = service;
    }

    /**
     * Sobreescribe el método create del controlador base para asegurar que
     * se establezca una contraseña por defecto al crear un usuario.
     */
    @Override
    @PostMapping
    public ResponseEntity<UsuarioDTO> create(@Valid @RequestBody UsuarioDTO dto) {
        try {
            // Usa el método create específico que establece una contraseña por defecto "Minseg2025-"
            UsuarioDTO created = usuarioService.create(dto, "Minseg2025-");
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            // Log del error detallado para diagnóstico en el servidor
            log.error("Error al crear usuario: {}", e.getMessage(), e);
            // Re-lanzar la excepción para que sea manejada por el GlobalExceptionHandler
            throw e;
        }
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody CambioPasswordDTO cambioDTO) {
        usuarioService.changePassword(id, cambioDTO.getNewPassword());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/rol")
    public ResponseEntity<List<UsuarioDTO>> findByRol(@RequestParam Rol rol) {
        return ResponseEntity.ok(usuarioService.findByRol(rol));
    }

    @GetMapping("/search/nombre")
    public ResponseEntity<UsuarioDTO> findByNombre(@RequestParam String nombre) {
        return usuarioService.findByNombre(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/email")
    public ResponseEntity<UsuarioDTO> findByEmail(@RequestParam String email) {
        return usuarioService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPasswordAnd2FA(@PathVariable Long id) {
        usuarioService.resetPasswordAnd2FA(id);
        return ResponseEntity.ok().build();
    }
} 