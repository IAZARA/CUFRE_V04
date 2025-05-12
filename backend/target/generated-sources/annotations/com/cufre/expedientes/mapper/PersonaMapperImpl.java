package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.DomicilioDTO;
import com.cufre.expedientes.dto.MedioComunicacionDTO;
import com.cufre.expedientes.dto.PersonaDTO;
import com.cufre.expedientes.model.Domicilio;
import com.cufre.expedientes.model.MedioComunicacion;
import com.cufre.expedientes.model.Persona;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-12T17:41:56-0300",
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

        personaDTO.domicilios( domicilioSetToDomicilioDTOList( persona.getDomicilios() ) );
        personaDTO.mediosComunicacion( medioComunicacionSetToMedioComunicacionDTOList( persona.getMediosComunicacion() ) );
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
        persona.setDomicilios( domicilioDTOListToDomicilioSet( personaDTO.getDomicilios() ) );
        persona.setMediosComunicacion( medioComunicacionDTOListToMedioComunicacionSet( personaDTO.getMediosComunicacion() ) );

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
            Set<Domicilio> set = domicilioDTOListToDomicilioSet( personaDTO.getDomicilios() );
            if ( set != null ) {
                persona.getDomicilios().clear();
                persona.getDomicilios().addAll( set );
            }
            else {
                persona.setDomicilios( null );
            }
        }
        else {
            Set<Domicilio> set = domicilioDTOListToDomicilioSet( personaDTO.getDomicilios() );
            if ( set != null ) {
                persona.setDomicilios( set );
            }
        }
        if ( persona.getMediosComunicacion() != null ) {
            Set<MedioComunicacion> set1 = medioComunicacionDTOListToMedioComunicacionSet( personaDTO.getMediosComunicacion() );
            if ( set1 != null ) {
                persona.getMediosComunicacion().clear();
                persona.getMediosComunicacion().addAll( set1 );
            }
            else {
                persona.setMediosComunicacion( null );
            }
        }
        else {
            Set<MedioComunicacion> set1 = medioComunicacionDTOListToMedioComunicacionSet( personaDTO.getMediosComunicacion() );
            if ( set1 != null ) {
                persona.setMediosComunicacion( set1 );
            }
        }

        return persona;
    }

    protected List<DomicilioDTO> domicilioSetToDomicilioDTOList(Set<Domicilio> set) {
        if ( set == null ) {
            return null;
        }

        List<DomicilioDTO> list = new ArrayList<DomicilioDTO>( set.size() );
        for ( Domicilio domicilio : set ) {
            list.add( domicilioMapper.toDto( domicilio ) );
        }

        return list;
    }

    protected List<MedioComunicacionDTO> medioComunicacionSetToMedioComunicacionDTOList(Set<MedioComunicacion> set) {
        if ( set == null ) {
            return null;
        }

        List<MedioComunicacionDTO> list = new ArrayList<MedioComunicacionDTO>( set.size() );
        for ( MedioComunicacion medioComunicacion : set ) {
            list.add( medioComunicacionMapper.toDto( medioComunicacion ) );
        }

        return list;
    }

    protected Set<Domicilio> domicilioDTOListToDomicilioSet(List<DomicilioDTO> list) {
        if ( list == null ) {
            return null;
        }

        Set<Domicilio> set = new LinkedHashSet<Domicilio>( Math.max( (int) ( list.size() / .75f ) + 1, 16 ) );
        for ( DomicilioDTO domicilioDTO : list ) {
            set.add( domicilioMapper.toEntity( domicilioDTO ) );
        }

        return set;
    }

    protected Set<MedioComunicacion> medioComunicacionDTOListToMedioComunicacionSet(List<MedioComunicacionDTO> list) {
        if ( list == null ) {
            return null;
        }

        Set<MedioComunicacion> set = new LinkedHashSet<MedioComunicacion>( Math.max( (int) ( list.size() / .75f ) + 1, 16 ) );
        for ( MedioComunicacionDTO medioComunicacionDTO : list ) {
            set.add( medioComunicacionMapper.toEntity( medioComunicacionDTO ) );
        }

        return set;
    }
}
