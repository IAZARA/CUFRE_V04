package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.MedioComunicacionDTO;
import com.cufre.expedientes.exception.ResourceNotFoundException;
import com.cufre.expedientes.mapper.MedioComunicacionMapper;
import com.cufre.expedientes.model.MedioComunicacion;
import com.cufre.expedientes.model.Persona;
import com.cufre.expedientes.repository.MedioComunicacionRepository;
import com.cufre.expedientes.repository.PersonaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de medios de comunicación
 */
@Service
@Slf4j
public class MedioComunicacionService extends AbstractBaseService<MedioComunicacion, MedioComunicacionDTO, Long, MedioComunicacionRepository, MedioComunicacionMapper> {

    private final PersonaRepository personaRepository;

    public MedioComunicacionService(MedioComunicacionRepository repository, MedioComunicacionMapper mapper, PersonaRepository personaRepository) {
        super(repository, mapper);
        this.personaRepository = personaRepository;
    }

    @Override
    protected MedioComunicacionDTO toDto(MedioComunicacion entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected MedioComunicacion toEntity(MedioComunicacionDTO dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected MedioComunicacion updateEntity(MedioComunicacionDTO dto, MedioComunicacion entity) {
        return mapper.updateEntity(dto, entity);
    }

    @Override
    protected String getEntityName() {
        return "MedioComunicacion";
    }

    /**
     * Guarda un medio de comunicación asociándolo a una persona
     * @param medioComunicacionDTO Datos del medio de comunicación
     * @param personaId ID de la persona
     * @return Medio de comunicación guardado
     */
    @Transactional
    public MedioComunicacionDTO saveMedioComunicacionForPersona(MedioComunicacionDTO medioComunicacionDTO, Long personaId) {
        Persona persona = personaRepository.findById(personaId)
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + personaId));
        
        MedioComunicacion medioComunicacion = toEntity(medioComunicacionDTO);
        medioComunicacion.setPersona(persona);
        medioComunicacion = repository.save(medioComunicacion);
        
        log.info("Medio de comunicación creado para persona con ID: {}", personaId);
        return toDto(medioComunicacion);
    }

    /**
     * Busca medios de comunicación por persona
     * @param personaId ID de la persona
     * @return Lista de medios de comunicación de la persona
     */
    @Transactional(readOnly = true)
    public List<MedioComunicacionDTO> findByPersonaId(Long personaId) {
        return repository.findByPersonaId(personaId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Busca medios de comunicación por tipo
     * @param tipo Tipo de medio de comunicación (ej. TELEFONO, EMAIL)
     * @return Lista de medios de comunicación del tipo especificado
     */
    @Transactional(readOnly = true)
    public List<MedioComunicacionDTO> findByTipo(String tipo) {
        return repository.findByTipo(tipo).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Busca medios de comunicación que contienen un valor específico
     * @param valor Valor o parte del valor a buscar
     * @return Lista de medios de comunicación que contienen el valor
     */
    @Transactional(readOnly = true)
    public List<MedioComunicacionDTO> findByValorContaining(String valor) {
        return repository.findByValorContainingIgnoreCase(valor).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
} 