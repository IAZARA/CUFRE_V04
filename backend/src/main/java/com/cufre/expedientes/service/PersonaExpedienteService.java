package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.PersonaExpedienteDTO;
import com.cufre.expedientes.exception.ResourceNotFoundException;
import com.cufre.expedientes.mapper.PersonaExpedienteMapper;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.model.Persona;
import com.cufre.expedientes.model.PersonaExpediente;
import com.cufre.expedientes.repository.ExpedienteRepository;
import com.cufre.expedientes.repository.PersonaExpedienteRepository;
import com.cufre.expedientes.repository.PersonaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio para la gestión de relaciones entre personas y expedientes
 */
@Service
@Slf4j
public class PersonaExpedienteService extends AbstractBaseService<PersonaExpediente, PersonaExpedienteDTO, Long, PersonaExpedienteRepository, PersonaExpedienteMapper> {

    private final ExpedienteRepository expedienteRepository;
    private final PersonaRepository personaRepository;

    public PersonaExpedienteService(PersonaExpedienteRepository repository, PersonaExpedienteMapper mapper,
                                   ExpedienteRepository expedienteRepository, PersonaRepository personaRepository) {
        super(repository, mapper);
        this.expedienteRepository = expedienteRepository;
        this.personaRepository = personaRepository;
    }

    @Override
    protected PersonaExpedienteDTO toDto(PersonaExpediente entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected PersonaExpediente toEntity(PersonaExpedienteDTO dto) {
        PersonaExpediente personaExpediente = mapper.toEntity(dto);
        setRelaciones(personaExpediente, dto.getExpedienteId(), dto.getPersonaId());
        return personaExpediente;
    }

    @Override
    protected PersonaExpediente updateEntity(PersonaExpedienteDTO dto, PersonaExpediente entity) {
        PersonaExpediente personaExpediente = mapper.updateEntity(dto, entity);
        setRelaciones(personaExpediente, dto.getExpedienteId(), dto.getPersonaId());
        return personaExpediente;
    }

    @Override
    protected String getEntityName() {
        return "PersonaExpediente";
    }

    private void setRelaciones(PersonaExpediente personaExpediente, Long expedienteId, Long personaId) {
        if (expedienteId != null) {
            Expediente expediente = expedienteRepository.findById(expedienteId)
                    .orElseThrow(() -> new ResourceNotFoundException("Expediente no encontrado con id: " + expedienteId));
            personaExpediente.setExpediente(expediente);
        }
        
        if (personaId != null) {
            Persona persona = personaRepository.findById(personaId)
                    .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + personaId));
            personaExpediente.setPersona(persona);
        }
    }

    /**
     * Busca relaciones por ID de expediente
     * @param expedienteId ID del expediente
     * @return Lista de relaciones con el expediente especificado
     */
    @Transactional(readOnly = true)
    public List<PersonaExpedienteDTO> findByExpedienteId(Long expedienteId) {
        return repository.findByExpedienteId(expedienteId).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Busca relaciones por ID de persona
     * @param personaId ID de la persona
     * @return Lista de relaciones con la persona especificada
     */
    @Transactional(readOnly = true)
    public List<PersonaExpedienteDTO> findByPersonaId(Long personaId) {
        return repository.findByPersonaId(personaId).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Busca relaciones por rol de persona
     * @param tipoRelacion Rol o tipo de relación de la persona en el expediente
     * @return Lista de relaciones con el rol especificado
     */
    @Transactional(readOnly = true)
    public List<PersonaExpedienteDTO> findByRol(String tipoRelacion) {
        return repository.findByTipoRelacion(tipoRelacion).stream()
                .map(this::toDto)
                .toList();
    }
} 