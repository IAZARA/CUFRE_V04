package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.MedioComunicacionDTO;
import com.cufre.expedientes.model.MedioComunicacion;
import com.cufre.expedientes.model.Persona;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-11T23:33:32-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Homebrew)"
)
@Component
public class MedioComunicacionMapperImpl implements MedioComunicacionMapper {

    @Override
    public MedioComunicacionDTO toDto(MedioComunicacion medioComunicacion) {
        if ( medioComunicacion == null ) {
            return null;
        }

        MedioComunicacionDTO.MedioComunicacionDTOBuilder medioComunicacionDTO = MedioComunicacionDTO.builder();

        medioComunicacionDTO.personaId( medioComunicacionPersonaId( medioComunicacion ) );
        medioComunicacionDTO.id( medioComunicacion.getId() );
        medioComunicacionDTO.tipo( medioComunicacion.getTipo() );
        medioComunicacionDTO.valor( medioComunicacion.getValor() );
        medioComunicacionDTO.observaciones( medioComunicacion.getObservaciones() );

        return medioComunicacionDTO.build();
    }

    @Override
    public MedioComunicacion toEntity(MedioComunicacionDTO medioComunicacionDTO) {
        if ( medioComunicacionDTO == null ) {
            return null;
        }

        MedioComunicacion medioComunicacion = new MedioComunicacion();

        medioComunicacion.setId( medioComunicacionDTO.getId() );
        medioComunicacion.setTipo( medioComunicacionDTO.getTipo() );
        medioComunicacion.setValor( medioComunicacionDTO.getValor() );
        medioComunicacion.setObservaciones( medioComunicacionDTO.getObservaciones() );

        return medioComunicacion;
    }

    @Override
    public MedioComunicacion updateEntity(MedioComunicacionDTO medioComunicacionDTO, MedioComunicacion medioComunicacion) {
        if ( medioComunicacionDTO == null ) {
            return medioComunicacion;
        }

        medioComunicacion.setId( medioComunicacionDTO.getId() );
        medioComunicacion.setTipo( medioComunicacionDTO.getTipo() );
        medioComunicacion.setValor( medioComunicacionDTO.getValor() );
        medioComunicacion.setObservaciones( medioComunicacionDTO.getObservaciones() );

        return medioComunicacion;
    }

    private Long medioComunicacionPersonaId(MedioComunicacion medioComunicacion) {
        if ( medioComunicacion == null ) {
            return null;
        }
        Persona persona = medioComunicacion.getPersona();
        if ( persona == null ) {
            return null;
        }
        Long id = persona.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
