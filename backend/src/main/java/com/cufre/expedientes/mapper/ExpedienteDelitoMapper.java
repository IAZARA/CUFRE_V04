package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.ExpedienteDelitoDTO;
import com.cufre.expedientes.model.ExpedienteDelito;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {DelitoMapper.class}
)
public interface ExpedienteDelitoMapper {
    
    @Mapping(target = "expedienteId", source = "expediente.id")
    @Mapping(target = "delitoId", source = "delito.id")
    @Mapping(target = "delito", source = "delito")
    ExpedienteDelitoDTO toDto(ExpedienteDelito expedienteDelito);
    
    @Mapping(target = "expediente", source = "expedienteId", qualifiedByName = "expedienteFromId")
    @Mapping(target = "delito", source = "delitoId", qualifiedByName = "delitoFromId")
    ExpedienteDelito toEntity(ExpedienteDelitoDTO expedienteDelitoDTO);
    
    @Mapping(target = "expediente", source = "expedienteId", qualifiedByName = "expedienteFromId")
    @Mapping(target = "delito", source = "delitoId", qualifiedByName = "delitoFromId")
    ExpedienteDelito updateEntity(ExpedienteDelitoDTO expedienteDelitoDTO, @org.mapstruct.MappingTarget ExpedienteDelito expedienteDelito);

    // Métodos auxiliares para mapear por ID
    @org.mapstruct.Named("expedienteFromId")
    default com.cufre.expedientes.model.Expediente expedienteFromId(Long id) {
        if (id == null) return null;
        com.cufre.expedientes.model.Expediente e = new com.cufre.expedientes.model.Expediente();
        e.setId(id);
        return e;
    }
    @org.mapstruct.Named("delitoFromId")
    default com.cufre.expedientes.model.Delito delitoFromId(Long id) {
        if (id == null) return null;
        com.cufre.expedientes.model.Delito d = new com.cufre.expedientes.model.Delito();
        d.setId(id);
        return d;
    }
} 