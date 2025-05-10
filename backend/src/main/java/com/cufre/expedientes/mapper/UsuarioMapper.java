package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.UsuarioDTO;
import com.cufre.expedientes.model.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface UsuarioMapper {
    
    @Mapping(target = "creadoPorId", source = "creadoPor.id")
    UsuarioDTO toDto(Usuario usuario);
    
    @Mapping(target = "creadoPor", ignore = true)
    @Mapping(target = "usuariosCreados", ignore = true)
    @Mapping(target = "contrasena", ignore = true)
    Usuario toEntity(UsuarioDTO usuarioDTO);
    
    @Mapping(target = "creadoPor", ignore = true)
    @Mapping(target = "usuariosCreados", ignore = true)
    Usuario updateEntity(UsuarioDTO usuarioDTO, @org.mapstruct.MappingTarget Usuario usuario);
} 