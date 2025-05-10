package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.DocumentoDTO;
import com.cufre.expedientes.exception.ResourceNotFoundException;
import com.cufre.expedientes.mapper.DocumentoMapper;
import com.cufre.expedientes.model.Documento;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.repository.DocumentoRepository;
import com.cufre.expedientes.repository.ExpedienteRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Servicio para la gestión de documentos
 */
@Service
@Slf4j
public class DocumentoService extends AbstractBaseService<Documento, DocumentoDTO, Long, DocumentoRepository, DocumentoMapper> {

    private final ExpedienteRepository expedienteRepository;

    public DocumentoService(DocumentoRepository repository, DocumentoMapper mapper, ExpedienteRepository expedienteRepository) {
        super(repository, mapper);
        this.expedienteRepository = expedienteRepository;
    }

    @Override
    protected DocumentoDTO toDto(Documento entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected Documento toEntity(DocumentoDTO dto) {
        Documento documento = mapper.toEntity(dto);
        setExpediente(documento, dto.getExpedienteId());
        return documento;
    }

    @Override
    protected Documento updateEntity(DocumentoDTO dto, Documento entity) {
        Documento documento = mapper.updateEntity(dto, entity);
        setExpediente(documento, dto.getExpedienteId());
        return documento;
    }

    @Override
    protected String getEntityName() {
        return "Documento";
    }

    private void setExpediente(Documento documento, Long expedienteId) {
        if (expedienteId != null) {
            Expediente expediente = expedienteRepository.findById(expedienteId)
                    .orElseThrow(() -> new ResourceNotFoundException("Expediente no encontrado con id: " + expedienteId));
            documento.setExpediente(expediente);
        }
    }

    /**
     * Busca documentos por el ID del expediente asociado
     * @param expedienteId ID del expediente
     * @return Lista de documentos del expediente
     */
    @Transactional(readOnly = true)
    public List<DocumentoDTO> findByExpedienteId(Long expedienteId) {
        return repository.findByExpedienteId(expedienteId).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Busca documentos por tipo
     * @param tipo Tipo de documento
     * @return Lista de documentos del tipo especificado
     */
    @Transactional(readOnly = true)
    public List<DocumentoDTO> findByTipo(String tipo) {
        return repository.findByTipo(tipo).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Busca documentos por descripción (búsqueda parcial, no sensible a mayúsculas/minúsculas)
     * @param descripcion Texto a buscar en la descripción
     * @return Lista de documentos cuya descripción contiene el texto buscado
     */
    @Transactional(readOnly = true)
    public List<DocumentoDTO> findByDescripcion(String descripcion) {
        return repository.findByDescripcionContainingIgnoreCase(descripcion).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Busca documentos dentro de un rango de fechas
     * @param fechaInicio Fecha de inicio (inclusive)
     * @param fechaFin Fecha de fin (inclusive)
     * @return Lista de documentos dentro del rango de fechas
     */
    @Transactional(readOnly = true)
    public List<DocumentoDTO> findByFechasBetween(LocalDate fechaInicio, LocalDate fechaFin) {
        return repository.findByFechaBetween(fechaInicio, fechaFin).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Busca documentos por tipo y expediente
     * @param tipo Tipo de documento
     * @param expedienteId ID del expediente
     * @return Lista de documentos del tipo y expediente especificados
     */
    @Transactional(readOnly = true)
    public List<DocumentoDTO> findByTipoAndExpedienteId(String tipo, Long expedienteId) {
        return repository.findByTipoAndExpedienteId(tipo, expedienteId).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Documento documento = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Documento no encontrado con id: " + id));
        // Eliminar archivo físico si existe
        if (documento.getRutaArchivo() != null) {
            try {
                String ruta = documento.getRutaArchivo();
                String uploadsDir = "backend/uploads"; // Ajusta si usas otra ruta o variable
                String relativePath = ruta.startsWith("/uploads/") ? ruta.substring("/uploads/".length()) : ruta;
                Path filePath = Paths.get(uploadsDir).resolve(relativePath).toAbsolutePath().normalize();
                Files.deleteIfExists(filePath);
                log.info("Archivo físico eliminado: {}", filePath);
            } catch (Exception e) {
                log.warn("No se pudo eliminar el archivo físico del documento: {}", documento.getRutaArchivo(), e);
            }
        }
        repository.delete(documento);
    }
} 