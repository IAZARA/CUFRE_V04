package com.cufre.expedientes.service;

import com.cufre.expedientes.dto.PersonaExpedienteDTO;
import com.cufre.expedientes.dto.PersonaDTO;
import com.cufre.expedientes.exception.ResourceNotFoundException;
import com.cufre.expedientes.mapper.PersonaExpedienteMapper;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.model.Persona;
import com.cufre.expedientes.model.PersonaExpediente;
import com.cufre.expedientes.repository.ExpedienteRepository;
import com.cufre.expedientes.repository.PersonaExpedienteRepository;
import com.cufre.expedientes.repository.PersonaRepository;
import com.cufre.expedientes.service.PersonaService;
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
    private final PersonaService personaService;

    public PersonaExpedienteService(PersonaExpedienteRepository repository, PersonaExpedienteMapper mapper,
                                   ExpedienteRepository expedienteRepository, PersonaRepository personaRepository,
                                   PersonaService personaService) {
        super(repository, mapper);
        this.expedienteRepository = expedienteRepository;
        this.personaRepository = personaRepository;
        this.personaService = personaService;
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

    /**
     * Crea la relación PersonaExpediente asegurando que la persona exista y tenga ID
     */
    @Transactional
    public PersonaExpedienteDTO savePersonaExpediente(PersonaExpedienteDTO dto) {
        Long personaId = dto.getPersonaId();
        PersonaDTO personaDTO = dto.getPersona();
        if (personaId == null && personaDTO != null) {
            // Buscar por tipoDocumento+numeroDocumento
            String tipoDoc = personaDTO.getTipoDocumento() != null ? personaDTO.getTipoDocumento() : "DNI";
            String numeroDoc = personaDTO.getNumeroDocumento();
            if (numeroDoc == null || numeroDoc.isBlank()) {
                throw new IllegalArgumentException("El número de documento es obligatorio para crear o asociar una persona");
            }
            var personaOpt = personaRepository.findByTipoDocumentoAndNumeroDocumento(tipoDoc, numeroDoc);
            Persona persona;
            if (personaOpt.isPresent()) {
                persona = personaOpt.get();
                // Si nombre o apellido difieren, loguear warning pero usar la existente
                if ((personaDTO.getNombre() != null && !personaDTO.getNombre().equalsIgnoreCase(persona.getNombre())) ||
                    (personaDTO.getApellido() != null && !personaDTO.getApellido().equalsIgnoreCase(persona.getApellido()))) {
                    log.warn("Intento de asociar persona con documento existente pero distinto nombre/apellido. Se usará la persona existente. Documento: {} {}, Nombre BD: {} {}, Nombre recibido: {} {}", tipoDoc, numeroDoc, persona.getNombre(), persona.getApellido(), personaDTO.getNombre(), personaDTO.getApellido());
                }
            } else {
                PersonaDTO personaCreada = personaService.save(personaDTO);
                persona = personaRepository.findById(personaCreada.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Persona creada no encontrada con id: " + personaCreada.getId()));
            }
            dto.setPersonaId(persona.getId());
            dto.setPersona(null); // Limpiar el campo persona para evitar inconsistencias
        }
        if (dto.getPersonaId() == null) {
            throw new IllegalArgumentException("No se pudo determinar el ID de la persona para asociar al expediente");
        }
        // --- REFORZADO: Verificar si ya existe la relación antes de guardar ---
        Long expedienteId = dto.getExpedienteId();
        if (expedienteId != null && dto.getPersonaId() != null && dto.getTipoRelacion() != null) {
            var existente = repository.buscarPorExpedientePersonaYRelacion(expedienteId, dto.getPersonaId(), dto.getTipoRelacion());
            if (existente.isPresent()) {
                log.info("La relación PersonaExpediente ya existe para expediente {}, persona {} y tipoRelacion {}. No se crea duplicado.", expedienteId, dto.getPersonaId(), dto.getTipoRelacion());
                return toDto(existente.get());
            }
        }
        // --- FIN REFORZADO ---
        PersonaExpediente entity = toEntity(dto);
        PersonaExpediente saved = repository.save(entity);
        return toDto(saved);
    }
} 