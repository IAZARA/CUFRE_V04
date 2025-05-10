package com.cufre.expedientes.controller;

import com.cufre.expedientes.dto.DocumentoDTO;
import com.cufre.expedientes.dto.FotografiaDTO;
import com.cufre.expedientes.service.ArchivoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Controlador para la gestión de archivos (fotografías y documentos).
 */
@RestController
@RequestMapping("/archivos")
@RequiredArgsConstructor
@Slf4j
public class ArchivoController {

    private final ArchivoService archivoService;

    /**
     * Sube una fotografía asociada a un expediente
     *
     * @param expedienteId ID del expediente
     * @param file Archivo de la fotografía
     * @param descripcion Descripción de la fotografía
     * @return Respuesta con la información de la fotografía guardada
     */
    @PostMapping("/fotografias/{expedienteId}")
    public ResponseEntity<FotografiaDTO> subirFotografia(
            @PathVariable Long expedienteId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("descripcion") String descripcion) {
        
        log.info("Subiendo fotografía para expediente ID: {}", expedienteId);
        FotografiaDTO fotografia = archivoService.guardarFotografia(expedienteId, file, descripcion);
        return new ResponseEntity<>(fotografia, HttpStatus.CREATED);
    }

    /**
     * Sube un documento asociado a un expediente
     *
     * @param expedienteId ID del expediente
     * @param file Archivo del documento
     * @param tipo Tipo de documento
     * @param descripcion Descripción del documento
     * @return Respuesta con la información del documento guardado
     */
    @PostMapping("/documentos/{expedienteId}")
    public ResponseEntity<DocumentoDTO> subirDocumento(
            @PathVariable Long expedienteId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("tipo") String tipo,
            @RequestParam("descripcion") String descripcion) {
        
        log.info("Subiendo documento para expediente ID: {} de tipo: {}", expedienteId, tipo);
        DocumentoDTO documento = archivoService.guardarDocumento(expedienteId, file, tipo, descripcion);
        return new ResponseEntity<>(documento, HttpStatus.CREATED);
    }

    /**
     * Descarga una fotografía
     *
     * @param id ID de la fotografía
     * @return Archivo de la fotografía
     */
    @GetMapping("/fotografias/{id}")
    public ResponseEntity<Resource> descargarFotografia(@PathVariable Long id) {
        log.info("Descargando fotografía ID: {}", id);
        Resource resource = archivoService.cargarFotografia(id);
        return prepararRespuestaDeArchivo(resource);
    }

    /**
     * Descarga un documento
     *
     * @param id ID del documento
     * @return Archivo del documento
     */
    @GetMapping("/documentos/{id}")
    public ResponseEntity<Resource> descargarDocumento(@PathVariable Long id) {
        log.info("Descargando documento ID: {}", id);
        Resource resource = archivoService.cargarDocumento(id);
        return prepararRespuestaDeArchivo(resource);
    }

    /**
     * Prepara la respuesta HTTP para la descarga de un archivo
     *
     * @param resource Recurso del archivo
     * @return Respuesta HTTP con el archivo
     */
    private ResponseEntity<Resource> prepararRespuestaDeArchivo(Resource resource) {
        String contentType;
        try {
            Path path = Paths.get(resource.getURI());
            contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
        } catch (IOException ex) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
} 