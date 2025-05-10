package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.FotografiaDTO;
import com.cufre.expedientes.exception.ResourceNotFoundException;
import com.cufre.expedientes.mapper.FotografiaMapper;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.model.Fotografia;
import com.cufre.expedientes.repository.ExpedienteRepository;
import com.cufre.expedientes.repository.FotografiaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de fotografías
 */
@Service
@Slf4j
public class FotografiaService extends AbstractBaseService<Fotografia, FotografiaDTO, Long, FotografiaRepository, FotografiaMapper> {

    private final ExpedienteRepository expedienteRepository;

    public FotografiaService(FotografiaRepository repository, FotografiaMapper mapper, ExpedienteRepository expedienteRepository) {
        super(repository, mapper);
        this.expedienteRepository = expedienteRepository;
    }

    @Override
    protected FotografiaDTO toDto(Fotografia entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected Fotografia toEntity(FotografiaDTO dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected Fotografia updateEntity(FotografiaDTO dto, Fotografia entity) {
        return mapper.updateEntity(dto, entity);
    }

    @Override
    protected String getEntityName() {
        return "Fotografia";
    }

    /**
     * Guarda una fotografía asociada a un expediente
     * @param file Archivo de la fotografía
     * @param descripcion Descripción de la fotografía
     * @param expedienteId ID del expediente
     * @return Fotografía guardada
     * @throws IOException Si hay problemas al procesar el archivo
     */
    @Transactional
    public FotografiaDTO saveFotografiaForExpediente(MultipartFile file, String descripcion, Long expedienteId) throws IOException {
        Expediente expediente = expedienteRepository.findById(expedienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Expediente no encontrado con id: " + expedienteId));
        
        Fotografia fotografia = new Fotografia();
        fotografia.setExpediente(expediente);
        fotografia.setDescripcion(descripcion);
        fotografia.setFecha(LocalDate.now());
        fotografia.setNombreArchivo(file.getOriginalFilename());
        fotografia.setTipoArchivo(file.getContentType());
        fotografia.setDatos(file.getBytes());
        fotografia.setTamanio(file.getSize());
        
        fotografia = repository.save(fotografia);
        log.info("Fotografía guardada para expediente ID: {}", expedienteId);
        
        return toDto(fotografia);
    }

    /**
     * Busca fotografías por expediente
     * @param expedienteId ID del expediente
     * @return Lista de fotografías del expediente
     */
    @Transactional(readOnly = true)
    public List<FotografiaDTO> findByExpedienteId(Long expedienteId) {
        return repository.findByExpedienteId(expedienteId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca fotografías por descripción
     * @param descripcion Texto de la descripción
     * @return Lista de fotografías que coinciden con la descripción
     */
    @Transactional(readOnly = true)
    public List<FotografiaDTO> findByDescripcion(String descripcion) {
        return repository.findByDescripcionContainingIgnoreCase(descripcion).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Elimina una fotografía asociada a un expediente
     * @param expedienteId ID del expediente
     * @param fotografiaId ID de la fotografía
     */
    @Transactional
    public void eliminarFotografiaDeExpediente(Long expedienteId, Long fotografiaId) {
        Fotografia fotografia = repository.findById(fotografiaId)
            .orElseThrow(() -> new ResourceNotFoundException("Fotografía no encontrada con id: " + fotografiaId));
        if (!fotografia.getExpediente().getId().equals(expedienteId)) {
            throw new ResourceNotFoundException("La fotografía no pertenece al expediente especificado");
        }
        repository.delete(fotografia);
        log.info("Fotografía {} eliminada del expediente {}", fotografiaId, expedienteId);
    }
} 