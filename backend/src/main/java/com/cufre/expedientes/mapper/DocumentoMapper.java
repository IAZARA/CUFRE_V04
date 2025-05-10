package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.DocumentoDTO;
import com.cufre.expedientes.model.Documento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface DocumentoMapper {
    
    @Mapping(target = "expedienteId", source = "expediente.id")
    DocumentoDTO toDto(Documento documento);
    
    @Mapping(target = "expediente", ignore = true)
    Documento toEntity(DocumentoDTO documentoDTO);
    
    @Mapping(target = "expediente", ignore = true)
    Documento updateEntity(DocumentoDTO documentoDTO, @org.mapstruct.MappingTarget Documento documento);
} 