package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.PersonaDTO;
import com.cufre.expedientes.model.Persona;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {DomicilioMapper.class, MedioComunicacionMapper.class}
)
public interface PersonaMapper {
    
    @Mapping(target = "domicilios", source = "domicilios")
    @Mapping(target = "mediosComunicacion", source = "mediosComunicacion")
    PersonaDTO toDto(Persona persona);
    
    @Mapping(target = "personaExpedientes", ignore = true)
    Persona toEntity(PersonaDTO personaDTO);
    
    @Mapping(target = "personaExpedientes", ignore = true)
    Persona updateEntity(PersonaDTO personaDTO, @org.mapstruct.MappingTarget Persona persona);
}