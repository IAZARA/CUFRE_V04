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
    
    @Mapping(target = "expediente", ignore = true)
    @Mapping(target = "delito", ignore = true)
    ExpedienteDelito toEntity(ExpedienteDelitoDTO expedienteDelitoDTO);
    
    @Mapping(target = "expediente", ignore = true)
    @Mapping(target = "delito", ignore = true)
    ExpedienteDelito updateEntity(ExpedienteDelitoDTO expedienteDelitoDTO, @org.mapstruct.MappingTarget ExpedienteDelito expedienteDelito);
} 