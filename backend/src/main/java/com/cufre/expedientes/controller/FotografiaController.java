package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.FotografiaDTO;
import com.cufre.expedientes.model.Fotografia;
import com.cufre.expedientes.service.FotografiaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Controlador para operaciones relacionadas con fotografías.
 */
@RestController
@RequestMapping("/fotografias")
@Slf4j
public class FotografiaController extends AbstractBaseController<Fotografia, FotografiaDTO, Long> {
    
    private final FotografiaService fotografiaService;
    
    public FotografiaController(FotografiaService service) {
        super(service);
        this.fotografiaService = service;
    }
    
    @PostMapping(value = "/expediente/{expedienteId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FotografiaDTO> uploadFotografia(
            @PathVariable Long expedienteId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "descripcion", required = false) String descripcion) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fotografiaService.saveFotografiaForExpediente(file, descripcion, expedienteId));
    }
    
    @GetMapping("/expediente/{expedienteId}")
    public ResponseEntity<List<FotografiaDTO>> findByExpedienteId(@PathVariable Long expedienteId) {
        return ResponseEntity.ok(fotografiaService.findByExpedienteId(expedienteId));
    }
    
    @GetMapping("/search/descripcion")
    public ResponseEntity<List<FotografiaDTO>> findByDescripcion(@RequestParam String descripcion) {
        return ResponseEntity.ok(fotografiaService.findByDescripcion(descripcion));
    }
    
    @GetMapping("/{id}/datos")
    public ResponseEntity<byte[]> getFotografiaDatos(@PathVariable Long id) {
        FotografiaDTO fotografia = fotografiaService.findById(id);
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(fotografia.getTipoArchivo()))
                .contentLength(fotografia.getTamanio())
                .body(fotografia.getDatos());
    }
} 