package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.ExpedienteDelitoDTO;
import com.cufre.expedientes.model.Delito;
import com.cufre.expedientes.model.Expediente;
import com.cufre.expedientes.model.ExpedienteDelito;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-12T17:41:56-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Homebrew)"
)
@Component
public class ExpedienteDelitoMapperImpl implements ExpedienteDelitoMapper {

    @Autowired
    private DelitoMapper delitoMapper;

    @Override
    public ExpedienteDelitoDTO toDto(ExpedienteDelito expedienteDelito) {
        if ( expedienteDelito == null ) {
            return null;
        }

        ExpedienteDelitoDTO.ExpedienteDelitoDTOBuilder expedienteDelitoDTO = ExpedienteDelitoDTO.builder();

        expedienteDelitoDTO.expedienteId( expedienteDelitoExpedienteId( expedienteDelito ) );
        expedienteDelitoDTO.delitoId( expedienteDelitoDelitoId( expedienteDelito ) );
        expedienteDelitoDTO.delito( delitoMapper.toDto( expedienteDelito.getDelito() ) );
        expedienteDelitoDTO.id( expedienteDelito.getId() );
        expedienteDelitoDTO.observaciones( expedienteDelito.getObservaciones() );

        return expedienteDelitoDTO.build();
    }

    @Override
    public ExpedienteDelito toEntity(ExpedienteDelitoDTO expedienteDelitoDTO) {
        if ( expedienteDelitoDTO == null ) {
            return null;
        }

        ExpedienteDelito expedienteDelito = new ExpedienteDelito();

        expedienteDelito.setExpediente( expedienteFromId( expedienteDelitoDTO.getExpedienteId() ) );
        expedienteDelito.setDelito( delitoFromId( expedienteDelitoDTO.getDelitoId() ) );
        expedienteDelito.setId( expedienteDelitoDTO.getId() );
        expedienteDelito.setObservaciones( expedienteDelitoDTO.getObservaciones() );

        return expedienteDelito;
    }

    @Override
    public ExpedienteDelito updateEntity(ExpedienteDelitoDTO expedienteDelitoDTO, ExpedienteDelito expedienteDelito) {
        if ( expedienteDelitoDTO == null ) {
            return expedienteDelito;
        }

        expedienteDelito.setExpediente( expedienteFromId( expedienteDelitoDTO.getExpedienteId() ) );
        expedienteDelito.setDelito( delitoFromId( expedienteDelitoDTO.getDelitoId() ) );
        expedienteDelito.setId( expedienteDelitoDTO.getId() );
        expedienteDelito.setObservaciones( expedienteDelitoDTO.getObservaciones() );

        return expedienteDelito;
    }

    private Long expedienteDelitoExpedienteId(ExpedienteDelito expedienteDelito) {
        if ( expedienteDelito == null ) {
            return null;
        }
        Expediente expediente = expedienteDelito.getExpediente();
        if ( expediente == null ) {
            return null;
        }
        Long id = expediente.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long expedienteDelitoDelitoId(ExpedienteDelito expedienteDelito) {
        if ( expedienteDelito == null ) {
            return null;
        }
        Delito delito = expedienteDelito.getDelito();
        if ( delito == null ) {
            return null;
        }
        Long id = delito.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
