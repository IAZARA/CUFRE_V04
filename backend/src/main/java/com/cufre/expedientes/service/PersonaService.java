package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.PersonaDTO;
import com.cufre.expedientes.mapper.PersonaMapper;
import com.cufre.expedientes.model.Persona;
import com.cufre.expedientes.repository.PersonaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de personas
 */
@Service
@Slf4j
public class PersonaService extends AbstractBaseService<Persona, PersonaDTO, Long, PersonaRepository, PersonaMapper> {

    public PersonaService(PersonaRepository repository, PersonaMapper mapper) {
        super(repository, mapper);
    }

    @Override
    protected PersonaDTO toDto(Persona entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected Persona toEntity(PersonaDTO dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected Persona updateEntity(PersonaDTO dto, Persona entity) {
        return mapper.updateEntity(dto, entity);
    }

    @Override
    protected String getEntityName() {
        return "Persona";
    }

    /**
     * Busca personas por número de documento
     * @param numeroDocumento Número de documento
     * @return Lista de personas con el número de documento
     */
    @Transactional(readOnly = true)
    public List<PersonaDTO> findByNumeroDocumento(String numeroDocumento) {
        return repository.findByNumeroDocumento(numeroDocumento).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Busca personas por nombre o apellido
     * @param nombre Nombre o parte del nombre
     * @param apellido Apellido o parte del apellido
     * @return Lista de personas que coinciden con el criterio
     */
    @Transactional(readOnly = true)
    public List<PersonaDTO> findByNombreOrApellido(String nombre, String apellido) {
        return repository.findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(nombre, apellido).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Busca personas por expedienteId
     * @param expedienteId Id del expediente
     * @return Lista de personas relacionadas con el expediente
     */
    @Transactional(readOnly = true)
    public List<PersonaDTO> findByExpedienteId(Long expedienteId) {
        return repository.findByExpedienteId(expedienteId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
} 