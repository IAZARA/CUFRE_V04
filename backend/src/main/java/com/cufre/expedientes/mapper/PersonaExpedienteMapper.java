package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.PersonaExpedienteDTO;
import com.cufre.expedientes.model.PersonaExpediente;
import com.cufre.expedientes.dto.MedioComunicacionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {PersonaMapper.class, MedioComunicacionMapper.class}
)
public interface PersonaExpedienteMapper {
    
    @Mapping(target = "personaId", source = "persona.id")
    @Mapping(target = "expedienteId", source = "expediente.id")
    @Mapping(target = "persona", source = "persona")
    @Mapping(target = "domicilios", source = "persona.domicilios")
    @Mapping(target = "mediosComunicacion", source = "persona.mediosComunicacion")
    PersonaExpedienteDTO toDto(PersonaExpediente personaExpediente);
    
    @Mapping(target = "persona", ignore = true)
    @Mapping(target = "expediente", ignore = true)
    PersonaExpediente toEntity(PersonaExpedienteDTO personaExpedienteDTO);
    
    @Mapping(target = "persona", ignore = true)
    @Mapping(target = "expediente", ignore = true)
    PersonaExpediente updateEntity(PersonaExpedienteDTO personaExpedienteDTO, @org.mapstruct.MappingTarget PersonaExpediente personaExpediente);
} 