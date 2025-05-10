package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.FotografiaDTO;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.model.Fotografia;
import java.util.Arrays;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-09T21:40:02-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Homebrew)"
)
@Component
public class FotografiaMapperImpl implements FotografiaMapper {

    @Override
    public FotografiaDTO toDto(Fotografia fotografia) {
        if ( fotografia == null ) {
            return null;
        }

        FotografiaDTO.FotografiaDTOBuilder fotografiaDTO = FotografiaDTO.builder();

        fotografiaDTO.expedienteId( fotografiaExpedienteId( fotografia ) );
        fotografiaDTO.id( fotografia.getId() );
        fotografiaDTO.rutaArchivo( fotografia.getRutaArchivo() );
        fotografiaDTO.descripcion( fotografia.getDescripcion() );
        fotografiaDTO.fecha( fotografia.getFecha() );
        fotografiaDTO.nombreArchivo( fotografia.getNombreArchivo() );
        fotografiaDTO.tipoArchivo( fotografia.getTipoArchivo() );
        byte[] datos = fotografia.getDatos();
        if ( datos != null ) {
            fotografiaDTO.datos( Arrays.copyOf( datos, datos.length ) );
        }
        fotografiaDTO.tamanio( fotografia.getTamanio() );

        return fotografiaDTO.build();
    }

    @Override
    public Fotografia toEntity(FotografiaDTO fotografiaDTO) {
        if ( fotografiaDTO == null ) {
            return null;
        }

        Fotografia fotografia = new Fotografia();

        fotografia.setId( fotografiaDTO.getId() );
        fotografia.setRutaArchivo( fotografiaDTO.getRutaArchivo() );
        fotografia.setDescripcion( fotografiaDTO.getDescripcion() );
        fotografia.setFecha( fotografiaDTO.getFecha() );
        fotografia.setNombreArchivo( fotografiaDTO.getNombreArchivo() );
        fotografia.setTipoArchivo( fotografiaDTO.getTipoArchivo() );
        byte[] datos = fotografiaDTO.getDatos();
        if ( datos != null ) {
            fotografia.setDatos( Arrays.copyOf( datos, datos.length ) );
        }
        fotografia.setTamanio( fotografiaDTO.getTamanio() );

        return fotografia;
    }

    @Override
    public Fotografia updateEntity(FotografiaDTO fotografiaDTO, Fotografia fotografia) {
        if ( fotografiaDTO == null ) {
            return fotografia;
        }

        fotografia.setId( fotografiaDTO.getId() );
        fotografia.setRutaArchivo( fotografiaDTO.getRutaArchivo() );
        fotografia.setDescripcion( fotografiaDTO.getDescripcion() );
        fotografia.setFecha( fotografiaDTO.getFecha() );
        fotografia.setNombreArchivo( fotografiaDTO.getNombreArchivo() );
        fotografia.setTipoArchivo( fotografiaDTO.getTipoArchivo() );
        byte[] datos = fotografiaDTO.getDatos();
        if ( datos != null ) {
            fotografia.setDatos( Arrays.copyOf( datos, datos.length ) );
        }
        else {
            fotografia.setDatos( null );
        }
        fotografia.setTamanio( fotografiaDTO.getTamanio() );

        return fotografia;
    }

    private Long fotografiaExpedienteId(Fotografia fotografia) {
        if ( fotografia == null ) {
            return null;
        }
        Expediente expediente = fotografia.getExpediente();
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
