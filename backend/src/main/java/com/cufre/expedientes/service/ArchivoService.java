package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.DocumentoDTO;
import com.cufre.expedientes.dto.FotografiaDTO;
import com.cufre.expedientes.exception.FileStorageException;
import com.cufre.expedientes.exception.ResourceNotFoundException;
import com.cufre.expedientes.mapper.DocumentoMapper;
import com.cufre.expedientes.mapper.FotografiaMapper;
import com.cufre.expedientes.model.Documento;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.model.Fotografia;
import com.cufre.expedientes.repository.DocumentoRepository;
import com.cufre.expedientes.repository.ExpedienteRepository;
import com.cufre.expedientes.repository.FotografiaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Servicio para gestionar la subida, almacenamiento y recuperación de archivos.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ArchivoService {

    private final ExpedienteRepository expedienteRepository;
    private final FotografiaRepository fotografiaRepository;
    private final DocumentoRepository documentoRepository;
    private final FotografiaMapper fotografiaMapper;
    private final DocumentoMapper documentoMapper;
    
    @Value("${app.uploads.dir:uploads}")
    private String uploadsDir;
    
    /**
     * Guarda una fotografía asociada a un expediente
     * 
     * @param expedienteId ID del expediente
     * @param file Archivo de la fotografía
     * @param descripcion Descripción de la fotografía
     * @return DTO con la información de la fotografía guardada
     */
    @Transactional
    public FotografiaDTO guardarFotografia(Long expedienteId, MultipartFile file, String descripcion) {
        // Buscar el expediente
        Expediente expediente = expedienteRepository.findById(expedienteId)
            .orElseThrow(() -> new ResourceNotFoundException("Expediente no encontrado con ID: " + expedienteId));
        
        // Generar nombre de archivo único para evitar colisiones
        String fileName = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path targetLocation = getUploadPath("fotografias").resolve(fileName);
        
        try {
            // Guardar el archivo físicamente
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Crear y configurar el objeto Fotografia
            Fotografia fotografia = new Fotografia();
            fotografia.setExpediente(expediente);
            fotografia.setRutaArchivo(targetLocation.toString());
            fotografia.setDescripcion(descripcion);
            fotografia.setFecha(LocalDate.now());
            fotografia.setNombreArchivo(file.getOriginalFilename());
            fotografia.setTipoArchivo(file.getContentType());
            fotografia.setTamanio(file.getSize());
            
            // Guardar también los datos binarios para asegurar que funcione en ambos modos
            try {
                fotografia.setDatos(file.getBytes());
            } catch (IOException e) {
                log.warn("No se pudieron guardar los datos binarios de la fotografía, solo se guardará la ruta", e);
            }
            
            // Importante: Usar el método de conveniencia para mantener la bidireccionalidad
            expediente.addFotografia(fotografia);
            
            // Guardar primero la fotografía
            fotografia = fotografiaRepository.save(fotografia);
            
            // Guardar el expediente actualizado para asegurar la persistencia de la relación
            expedienteRepository.save(expediente);
            
            log.info("Fotografía guardada con ID: {} para expediente ID: {}", fotografia.getId(), expedienteId);
            
            return fotografiaMapper.toDto(fotografia);
        } catch (IOException ex) {
            throw new FileStorageException("No se pudo guardar el archivo " + fileName, ex);
        }
    }
    
    /**
     * Guarda un documento asociado a un expediente
     * 
     * @param expedienteId ID del expediente
     * @param file Archivo del documento
     * @param tipo Tipo de documento
     * @param descripcion Descripción del documento
     * @return DTO con la información del documento guardado
     */
    @Transactional
    public DocumentoDTO guardarDocumento(Long expedienteId, MultipartFile file, String tipo, String descripcion) {
        // Buscar el expediente
        Expediente expediente = expedienteRepository.findById(expedienteId)
            .orElseThrow(() -> new ResourceNotFoundException("Expediente no encontrado con ID: " + expedienteId));
        
        // Generar nombre de archivo único para evitar colisiones
        String fileName = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path targetLocation = getUploadPath("documentos").resolve(fileName);
        
        try {
            // Guardar el archivo físicamente
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Crear y configurar el objeto Documento
            Documento documento = new Documento();
            documento.setExpediente(expediente);
            documento.setRutaArchivo(targetLocation.toString());
            documento.setTipo(tipo);
            documento.setDescripcion(descripcion);
            documento.setFecha(LocalDate.now());
            documento.setNombreArchivo(file.getOriginalFilename());
            documento.setTipoArchivo(file.getContentType());
            documento.setTamanio(file.getSize());
            
            // Guardar también los datos binarios para asegurar que funcione en ambos modos
            try {
                documento.setDatos(file.getBytes());
            } catch (IOException e) {
                log.warn("No se pudieron guardar los datos binarios del documento, solo se guardará la ruta", e);
            }
            
            // Importante: Usar el método de conveniencia para mantener la bidireccionalidad
            expediente.addDocumento(documento);
            
            // Guardar primero el documento
            documento = documentoRepository.save(documento);
            
            // Guardar el expediente actualizado para asegurar la persistencia de la relación
            expedienteRepository.save(expediente);
            
            log.info("Documento guardado con ID: {} para expediente ID: {}", documento.getId(), expedienteId);
            
            return documentoMapper.toDto(documento);
        } catch (IOException ex) {
            throw new FileStorageException("No se pudo guardar el archivo " + fileName, ex);
        }
    }
    
    /**
     * Carga una fotografía como recurso para su descarga
     * 
     * @param id ID de la fotografía
     * @return Recurso de la fotografía
     */
    public Resource cargarFotografia(Long id) {
        Fotografia fotografia = fotografiaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Fotografía no encontrada con ID: " + id));
        
        return cargarArchivo(fotografia.getRutaArchivo());
    }
    
    /**
     * Carga un documento como recurso para su descarga
     * 
     * @param id ID del documento
     * @return Recurso del documento
     */
    public Resource cargarDocumento(Long id) {
        Documento documento = documentoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Documento no encontrado con ID: " + id));
        
        return cargarArchivo(documento.getRutaArchivo());
    }
    
    /**
     * Carga un archivo desde la ruta especificada
     * 
     * @param rutaArchivo Ruta del archivo
     * @return Recurso del archivo
     */
    private Resource cargarArchivo(String rutaArchivo) {
        try {
            Path filePath = Paths.get(rutaArchivo);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new FileStorageException("No se pudo leer el archivo: " + rutaArchivo);
            }
        } catch (MalformedURLException ex) {
            throw new FileStorageException("URL malformado: " + rutaArchivo, ex);
        }
    }
    
    /**
     * Obtiene la ruta de carga para un tipo de archivo
     * 
     * @param subDir Subdirectorio para el tipo de archivo
     * @return Ruta de carga
     */
    private Path getUploadPath(String subDir) {
        Path uploadPath = Paths.get(uploadsDir).resolve(subDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
            return uploadPath;
        } catch (IOException ex) {
            throw new FileStorageException("No se pudo crear el directorio de carga: " + uploadPath, ex);
        }
    }
} 