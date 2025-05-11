package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.DelitoDTO;
import com.cufre.expedientes.model.Delito;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-11T11:19:40-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Homebrew)"
)
@Component
public class DelitoMapperImpl implements DelitoMapper {

    @Override
    public DelitoDTO toDto(Delito delito) {
        if ( delito == null ) {
            return null;
        }

        DelitoDTO.DelitoDTOBuilder delitoDTO = DelitoDTO.builder();

        delitoDTO.id( delito.getId() );
        delitoDTO.nombre( delito.getNombre() );
        delitoDTO.descripcion( delito.getDescripcion() );
        delitoDTO.codigoPenal( delito.getCodigoPenal() );
        delitoDTO.tipoPena( delito.getTipoPena() );
        delitoDTO.penaMinima( delito.getPenaMinima() );
        delitoDTO.penaMaxima( delito.getPenaMaxima() );
        delitoDTO.valoracion( delito.getValoracion() );
        delitoDTO.creadoEn( delito.getCreadoEn() );
        delitoDTO.actualizadoEn( delito.getActualizadoEn() );

        return delitoDTO.build();
    }

    @Override
    public Delito toEntity(DelitoDTO delitoDTO) {
        if ( delitoDTO == null ) {
            return null;
        }

        Delito delito = new Delito();

        delito.setId( delitoDTO.getId() );
        delito.setNombre( delitoDTO.getNombre() );
        delito.setDescripcion( delitoDTO.getDescripcion() );
        delito.setCodigoPenal( delitoDTO.getCodigoPenal() );
        delito.setTipoPena( delitoDTO.getTipoPena() );
        delito.setPenaMinima( delitoDTO.getPenaMinima() );
        delito.setPenaMaxima( delitoDTO.getPenaMaxima() );
        delito.setValoracion( delitoDTO.getValoracion() );
        delito.setCreadoEn( delitoDTO.getCreadoEn() );
        delito.setActualizadoEn( delitoDTO.getActualizadoEn() );

        return delito;
    }

    @Override
    public Delito updateEntity(DelitoDTO delitoDTO, Delito delito) {
        if ( delitoDTO == null ) {
            return delito;
        }

        delito.setId( delitoDTO.getId() );
        delito.setNombre( delitoDTO.getNombre() );
        delito.setDescripcion( delitoDTO.getDescripcion() );
        delito.setCodigoPenal( delitoDTO.getCodigoPenal() );
        delito.setTipoPena( delitoDTO.getTipoPena() );
        delito.setPenaMinima( delitoDTO.getPenaMinima() );
        delito.setPenaMaxima( delitoDTO.getPenaMaxima() );
        delito.setValoracion( delitoDTO.getValoracion() );
        delito.setCreadoEn( delitoDTO.getCreadoEn() );
        delito.setActualizadoEn( delitoDTO.getActualizadoEn() );

        return delito;
    }
}
