package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.DomicilioDTO;
import com.cufre.expedientes.model.Domicilio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface DomicilioMapper {
    
    @Mapping(target = "personaId", source = "persona.id")
    DomicilioDTO toDto(Domicilio domicilio);
    
    @Mapping(target = "persona", ignore = true)
    Domicilio toEntity(DomicilioDTO domicilioDTO);
    
    @Mapping(target = "persona", ignore = true)
    Domicilio updateEntity(DomicilioDTO domicilioDTO, @org.mapstruct.MappingTarget Domicilio domicilio);
} 