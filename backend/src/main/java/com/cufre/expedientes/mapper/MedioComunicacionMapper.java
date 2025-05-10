package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.MedioComunicacionDTO;
import com.cufre.expedientes.model.MedioComunicacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface MedioComunicacionMapper {
    
    @Mapping(target = "personaId", source = "persona.id")
    MedioComunicacionDTO toDto(MedioComunicacion medioComunicacion);
    
    @Mapping(target = "persona", ignore = true)
    MedioComunicacion toEntity(MedioComunicacionDTO medioComunicacionDTO);
    
    @Mapping(target = "persona", ignore = true)
    MedioComunicacion updateEntity(MedioComunicacionDTO medioComunicacionDTO, @org.mapstruct.MappingTarget MedioComunicacion medioComunicacion);
} 