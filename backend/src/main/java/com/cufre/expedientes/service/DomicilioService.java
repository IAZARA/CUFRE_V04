package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.DomicilioDTO;
import com.cufre.expedientes.exception.ResourceNotFoundException;
import com.cufre.expedientes.mapper.DomicilioMapper;
import com.cufre.expedientes.model.Domicilio;
import com.cufre.expedientes.model.Persona;
import com.cufre.expedientes.repository.DomicilioRepository;
import com.cufre.expedientes.repository.PersonaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de domicilios
 */
@Service
@Slf4j
public class DomicilioService extends AbstractBaseService<Domicilio, DomicilioDTO, Long, DomicilioRepository, DomicilioMapper> {

    private final PersonaRepository personaRepository;

    public DomicilioService(DomicilioRepository repository, DomicilioMapper mapper, PersonaRepository personaRepository) {
        super(repository, mapper);
        this.personaRepository = personaRepository;
    }

    @Override
    protected DomicilioDTO toDto(Domicilio entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected Domicilio toEntity(DomicilioDTO dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected Domicilio updateEntity(DomicilioDTO dto, Domicilio entity) {
        return mapper.updateEntity(dto, entity);
    }

    @Override
    protected String getEntityName() {
        return "Domicilio";
    }

    /**
     * Guarda un domicilio asociándolo a una persona
     * @param domicilioDTO Datos del domicilio
     * @param personaId ID de la persona
     * @return Domicilio guardado
     */
    @Transactional
    public DomicilioDTO saveDomicilioForPersona(DomicilioDTO domicilioDTO, Long personaId) {
        Persona persona = personaRepository.findById(personaId)
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + personaId));
        
        Domicilio domicilio = toEntity(domicilioDTO);
        domicilio.setPersona(persona);
        domicilio = repository.save(domicilio);
        
        log.info("Domicilio creado para persona con ID: {}", personaId);
        return toDto(domicilio);
    }

    /**
     * Busca domicilios por persona
     * @param personaId ID de la persona
     * @return Lista de domicilios de la persona
     */
    @Transactional(readOnly = true)
    public List<DomicilioDTO> findByPersonaId(Long personaId) {
        return repository.findByPersonaId(personaId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca domicilios por provincia
     * @param provincia Nombre de la provincia
     * @return Lista de domicilios en la provincia
     */
    @Transactional(readOnly = true)
    public List<DomicilioDTO> findByProvincia(String provincia) {
        return repository.findByProvinciaContainingIgnoreCase(provincia).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca domicilios por localidad
     * @param localidad Nombre de la localidad
     * @return Lista de domicilios en la localidad
     */
    @Transactional(readOnly = true)
    public List<DomicilioDTO> findByLocalidad(String localidad) {
        return repository.findByLocalidadContainingIgnoreCase(localidad).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
} 