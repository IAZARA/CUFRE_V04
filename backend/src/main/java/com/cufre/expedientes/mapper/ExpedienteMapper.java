package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.ExpedienteDTO;
import com.cufre.expedientes.model.Expediente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {FotografiaMapper.class, DocumentoMapper.class, PersonaExpedienteMapper.class, ExpedienteDelitoMapper.class}
)
public interface ExpedienteMapper {
    
    @Mapping(target = "fotografias", source = "fotografias")
    @Mapping(target = "documentos", source = "documentos")
    @Mapping(target = "personaExpedientes", source = "personaExpedientes")
    @Mapping(target = "delitos", ignore = true) // Mapeado manualmente
    ExpedienteDTO toDto(Expediente expediente);
    
    @Mapping(target = "fotografias", ignore = true)
    @Mapping(target = "documentos", ignore = true)
    @Mapping(target = "personaExpedientes", ignore = true)
    @Mapping(target = "expedienteDelitos", ignore = true)
    Expediente toEntity(ExpedienteDTO expedienteDTO);
    
    @Mapping(target = "fotografias", ignore = true)
    @Mapping(target = "documentos", ignore = true)
    @Mapping(target = "personaExpedientes", ignore = true)
    @Mapping(target = "expedienteDelitos", ignore = true)
    Expediente updateEntity(ExpedienteDTO expedienteDTO, @org.mapstruct.MappingTarget Expediente expediente);
} 