package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.DelitoDTO;
import com.cufre.expedientes.model.Delito;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface DelitoMapper {
    
    DelitoDTO toDto(Delito delito);
    
    @Mapping(target = "expedienteDelitos", ignore = true)
    Delito toEntity(DelitoDTO delitoDTO);
    
    @Mapping(target = "expedienteDelitos", ignore = true)
    Delito updateEntity(DelitoDTO delitoDTO, @org.mapstruct.MappingTarget Delito delito);
} 