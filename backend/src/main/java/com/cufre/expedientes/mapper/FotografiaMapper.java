package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.FotografiaDTO;
import com.cufre.expedientes.model.Fotografia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface FotografiaMapper {
    
    @Mapping(target = "expedienteId", source = "expediente.id")
    FotografiaDTO toDto(Fotografia fotografia);
    
    @Mapping(target = "expediente", ignore = true)
    Fotografia toEntity(FotografiaDTO fotografiaDTO);
    
    @Mapping(target = "expediente", ignore = true)
    Fotografia updateEntity(FotografiaDTO fotografiaDTO, @org.mapstruct.MappingTarget Fotografia fotografia);
} 