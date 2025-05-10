package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.DomicilioDTO;
import com.cufre.expedientes.dto.MedioComunicacionDTO;
import com.cufre.expedientes.dto.PersonaDTO;
import com.cufre.expedientes.model.Domicilio;
import com.cufre.expedientes.model.MedioComunicacion;
import com.cufre.expedientes.model.Persona;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-10T03:19:41-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Homebrew)"
)
@Component
public class PersonaMapperImpl implements PersonaMapper {

    @Autowired
    private DomicilioMapper domicilioMapper;
    @Autowired
    private MedioComunicacionMapper medioComunicacionMapper;

    @Override
    public PersonaDTO toDto(Persona persona) {
        if ( persona == null ) {
            return null;
        }

        PersonaDTO.PersonaDTOBuilder personaDTO = PersonaDTO.builder();

        personaDTO.domicilios( domicilioListToDomicilioDTOList( persona.getDomicilios() ) );
        personaDTO.mediosComunicacion( medioComunicacionListToMedioComunicacionDTOList( persona.getMediosComunicacion() ) );
        personaDTO.id( persona.getId() );
        personaDTO.tipoDocumento( persona.getTipoDocumento() );
        personaDTO.numeroDocumento( persona.getNumeroDocumento() );
        personaDTO.nombre( persona.getNombre() );
        personaDTO.apellido( persona.getApellido() );
        personaDTO.alias( persona.getAlias() );
        personaDTO.fechaNacimiento( persona.getFechaNacimiento() );
        personaDTO.edad( persona.getEdad() );
        personaDTO.nacionalidad( persona.getNacionalidad() );
        personaDTO.genero( persona.getGenero() );
        personaDTO.estadoCivil( persona.getEstadoCivil() );

        return personaDTO.build();
    }

    @Override
    public Persona toEntity(PersonaDTO personaDTO) {
        if ( personaDTO == null ) {
            return null;
        }

        Persona persona = new Persona();

        persona.setId( personaDTO.getId() );
        persona.setTipoDocumento( personaDTO.getTipoDocumento() );
        persona.setNumeroDocumento( personaDTO.getNumeroDocumento() );
        persona.setNombre( personaDTO.getNombre() );
        persona.setApellido( personaDTO.getApellido() );
        persona.setAlias( personaDTO.getAlias() );
        persona.setFechaNacimiento( personaDTO.getFechaNacimiento() );
        persona.setEdad( personaDTO.getEdad() );
        persona.setNacionalidad( personaDTO.getNacionalidad() );
        persona.setGenero( personaDTO.getGenero() );
        persona.setEstadoCivil( personaDTO.getEstadoCivil() );
        persona.setDomicilios( domicilioDTOListToDomicilioList( personaDTO.getDomicilios() ) );
        persona.setMediosComunicacion( medioComunicacionDTOListToMedioComunicacionList( personaDTO.getMediosComunicacion() ) );

        return persona;
    }

    @Override
    public Persona updateEntity(PersonaDTO personaDTO, Persona persona) {
        if ( personaDTO == null ) {
            return persona;
        }

        persona.setId( personaDTO.getId() );
        persona.setTipoDocumento( personaDTO.getTipoDocumento() );
        persona.setNumeroDocumento( personaDTO.getNumeroDocumento() );
        persona.setNombre( personaDTO.getNombre() );
        persona.setApellido( personaDTO.getApellido() );
        persona.setAlias( personaDTO.getAlias() );
        persona.setFechaNacimiento( personaDTO.getFechaNacimiento() );
        persona.setEdad( personaDTO.getEdad() );
        persona.setNacionalidad( personaDTO.getNacionalidad() );
        persona.setGenero( personaDTO.getGenero() );
        persona.setEstadoCivil( personaDTO.getEstadoCivil() );
        if ( persona.getDomicilios() != null ) {
            List<Domicilio> list = domicilioDTOListToDomicilioList( personaDTO.getDomicilios() );
            if ( list != null ) {
                persona.getDomicilios().clear();
                persona.getDomicilios().addAll( list );
            }
            else {
                persona.setDomicilios( null );
            }
        }
        else {
            List<Domicilio> list = domicilioDTOListToDomicilioList( personaDTO.getDomicilios() );
            if ( list != null ) {
                persona.setDomicilios( list );
            }
        }
        if ( persona.getMediosComunicacion() != null ) {
            List<MedioComunicacion> list1 = medioComunicacionDTOListToMedioComunicacionList( personaDTO.getMediosComunicacion() );
            if ( list1 != null ) {
                persona.getMediosComunicacion().clear();
                persona.getMediosComunicacion().addAll( list1 );
            }
            else {
                persona.setMediosComunicacion( null );
            }
        }
        else {
            List<MedioComunicacion> list1 = medioComunicacionDTOListToMedioComunicacionList( personaDTO.getMediosComunicacion() );
            if ( list1 != null ) {
                persona.setMediosComunicacion( list1 );
            }
        }

        return persona;
    }

    protected List<DomicilioDTO> domicilioListToDomicilioDTOList(List<Domicilio> list) {
        if ( list == null ) {
            return null;
        }

        List<DomicilioDTO> list1 = new ArrayList<DomicilioDTO>( list.size() );
        for ( Domicilio domicilio : list ) {
            list1.add( domicilioMapper.toDto( domicilio ) );
        }

        return list1;
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

    protected List<Domicilio> domicilioDTOListToDomicilioList(List<DomicilioDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<Domicilio> list1 = new ArrayList<Domicilio>( list.size() );
        for ( DomicilioDTO domicilioDTO : list ) {
            list1.add( domicilioMapper.toEntity( domicilioDTO ) );
        }

        return list1;
    }

    protected List<MedioComunicacion> medioComunicacionDTOListToMedioComunicacionList(List<MedioComunicacionDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<MedioComunicacion> list1 = new ArrayList<MedioComunicacion>( list.size() );
        for ( MedioComunicacionDTO medioComunicacionDTO : list ) {
            list1.add( medioComunicacionMapper.toEntity( medioComunicacionDTO ) );
        }

        return list1;
    }
}
