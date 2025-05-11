package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.PersonaExpedienteDTO;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.model.Persona;
import com.cufre.expedientes.model.PersonaExpediente;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-11T11:19:39-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Homebrew)"
)
@Component
public class PersonaExpedienteMapperImpl implements PersonaExpedienteMapper {

    @Autowired
    private PersonaMapper personaMapper;

    @Override
    public PersonaExpedienteDTO toDto(PersonaExpediente personaExpediente) {
        if ( personaExpediente == null ) {
            return null;
        }

        PersonaExpedienteDTO.PersonaExpedienteDTOBuilder personaExpedienteDTO = PersonaExpedienteDTO.builder();

        personaExpedienteDTO.personaId( personaExpedientePersonaId( personaExpediente ) );
        personaExpedienteDTO.expedienteId( personaExpedienteExpedienteId( personaExpediente ) );
        personaExpedienteDTO.persona( personaMapper.toDto( personaExpediente.getPersona() ) );
        personaExpedienteDTO.id( personaExpediente.getId() );
        personaExpedienteDTO.tipoRelacion( personaExpediente.getTipoRelacion() );
        personaExpedienteDTO.observaciones( personaExpediente.getObservaciones() );

        return personaExpedienteDTO.build();
    }

    @Override
    public PersonaExpediente toEntity(PersonaExpedienteDTO personaExpedienteDTO) {
        if ( personaExpedienteDTO == null ) {
            return null;
        }

        PersonaExpediente personaExpediente = new PersonaExpediente();

        personaExpediente.setId( personaExpedienteDTO.getId() );
        personaExpediente.setTipoRelacion( personaExpedienteDTO.getTipoRelacion() );
        personaExpediente.setObservaciones( personaExpedienteDTO.getObservaciones() );

        return personaExpediente;
    }

    @Override
    public PersonaExpediente updateEntity(PersonaExpedienteDTO personaExpedienteDTO, PersonaExpediente personaExpediente) {
        if ( personaExpedienteDTO == null ) {
            return personaExpediente;
        }

        personaExpediente.setId( personaExpedienteDTO.getId() );
        personaExpediente.setTipoRelacion( personaExpedienteDTO.getTipoRelacion() );
        personaExpediente.setObservaciones( personaExpedienteDTO.getObservaciones() );

        return personaExpediente;
    }

    private Long personaExpedientePersonaId(PersonaExpediente personaExpediente) {
        if ( personaExpediente == null ) {
            return null;
        }
        Persona persona = personaExpediente.getPersona();
        if ( persona == null ) {
            return null;
        }
        Long id = persona.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long personaExpedienteExpedienteId(PersonaExpediente personaExpediente) {
        if ( personaExpediente == null ) {
            return null;
        }
        Expediente expediente = personaExpediente.getExpediente();
        if ( expediente == null ) {
            return null;
        }
        Long id = expediente.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
