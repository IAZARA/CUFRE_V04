package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.DomicilioDTO;
import com.cufre.expedientes.dto.MedioComunicacionDTO;
import com.cufre.expedientes.dto.PersonaExpedienteDTO;
import com.cufre.expedientes.model.Domicilio;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.model.MedioComunicacion;
import com.cufre.expedientes.model.Persona;
import com.cufre.expedientes.model.PersonaExpediente;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-11T16:18:11-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Homebrew)"
)
@Component
public class PersonaExpedienteMapperImpl implements PersonaExpedienteMapper {

    @Autowired
    private PersonaMapper personaMapper;
    @Autowired
    private MedioComunicacionMapper medioComunicacionMapper;

    @Override
    public PersonaExpedienteDTO toDto(PersonaExpediente personaExpediente) {
        if ( personaExpediente == null ) {
            return null;
        }

        PersonaExpedienteDTO.PersonaExpedienteDTOBuilder personaExpedienteDTO = PersonaExpedienteDTO.builder();

        personaExpedienteDTO.personaId( personaExpedientePersonaId( personaExpediente ) );
        personaExpedienteDTO.expedienteId( personaExpedienteExpedienteId( personaExpediente ) );
        personaExpedienteDTO.persona( personaMapper.toDto( personaExpediente.getPersona() ) );
        List<Domicilio> domicilios = personaExpedientePersonaDomicilios( personaExpediente );
        personaExpedienteDTO.domicilios( domicilioListToDomicilioDTOList( domicilios ) );
        List<MedioComunicacion> mediosComunicacion = personaExpedientePersonaMediosComunicacion( personaExpediente );
        personaExpedienteDTO.mediosComunicacion( medioComunicacionListToMedioComunicacionDTOList( mediosComunicacion ) );
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

    private List<Domicilio> personaExpedientePersonaDomicilios(PersonaExpediente personaExpediente) {
        if ( personaExpediente == null ) {
            return null;
        }
        Persona persona = personaExpediente.getPersona();
        if ( persona == null ) {
            return null;
        }
        List<Domicilio> domicilios = persona.getDomicilios();
        if ( domicilios == null ) {
            return null;
        }
        return domicilios;
    }

    protected DomicilioDTO domicilioToDomicilioDTO(Domicilio domicilio) {
        if ( domicilio == null ) {
            return null;
        }

        DomicilioDTO.DomicilioDTOBuilder domicilioDTO = DomicilioDTO.builder();

        domicilioDTO.id( domicilio.getId() );
        domicilioDTO.calle( domicilio.getCalle() );
        domicilioDTO.numero( domicilio.getNumero() );
        domicilioDTO.piso( domicilio.getPiso() );
        domicilioDTO.departamento( domicilio.getDepartamento() );
        domicilioDTO.barrio( domicilio.getBarrio() );
        domicilioDTO.codigoPostal( domicilio.getCodigoPostal() );
        domicilioDTO.localidad( domicilio.getLocalidad() );
        domicilioDTO.provincia( domicilio.getProvincia() );
        domicilioDTO.pais( domicilio.getPais() );
        domicilioDTO.tipo( domicilio.getTipo() );
        domicilioDTO.esPrincipal( domicilio.getEsPrincipal() );
        domicilioDTO.descripcion( domicilio.getDescripcion() );

        return domicilioDTO.build();
    }

    protected List<DomicilioDTO> domicilioListToDomicilioDTOList(List<Domicilio> list) {
        if ( list == null ) {
            return null;
        }

        List<DomicilioDTO> list1 = new ArrayList<DomicilioDTO>( list.size() );
        for ( Domicilio domicilio : list ) {
            list1.add( domicilioToDomicilioDTO( domicilio ) );
        }

        return list1;
    }

    private List<MedioComunicacion> personaExpedientePersonaMediosComunicacion(PersonaExpediente personaExpediente) {
        if ( personaExpediente == null ) {
            return null;
        }
        Persona persona = personaExpediente.getPersona();
        if ( persona == null ) {
            return null;
        }
        List<MedioComunicacion> mediosComunicacion = persona.getMediosComunicacion();
        if ( mediosComunicacion == null ) {
            return null;
        }
        return mediosComunicacion;
    }

    protected List<MedioComunicacionDTO> medioComunicacionListToMedioComunicacionDTOList(List<MedioComunicacion> list) {
        if ( list == null ) {
            return null;
        }

        List<MedioComunicacionDTO> list1 = new ArrayList<MedioComunicacionDTO>( list.size() );
        for ( MedioComunicacion medioComunicacion : list ) {
            list1.add( medioComunicacionMapper.toDto( medioComunicacion ) );
        }

        return list1;
    }
}
