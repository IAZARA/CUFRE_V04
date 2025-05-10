package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.CambioPasswordDTO;
import com.cufre.expedientes.dto.UsuarioDTO;
import com.cufre.expedientes.model.Usuario;
import com.cufre.expedientes.model.enums.Rol;
import com.cufre.expedientes.service.UsuarioService;
import lombok.extern.slf4j.Slf4j;
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
} 