package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.UsuarioDTO;
import com.cufre.expedientes.model.Usuario;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-12T17:41:56-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Homebrew)"
)
@Component
public class UsuarioMapperImpl implements UsuarioMapper {

    @Override
    public UsuarioDTO toDto(Usuario usuario) {
        if ( usuario == null ) {
            return null;
        }

        UsuarioDTO.UsuarioDTOBuilder usuarioDTO = UsuarioDTO.builder();

        usuarioDTO.creadoPorId( usuarioCreadoPorId( usuario ) );
        usuarioDTO.requiereCambioContrasena( usuario.isRequiereCambioContrasena() );
        usuarioDTO.requiere2FA( usuario.isRequiere2FA() );
        usuarioDTO.secret2FA( usuario.getSecret2FA() );
        usuarioDTO.id( usuario.getId() );
        usuarioDTO.rol( usuario.getRol() );
        usuarioDTO.nombre( usuario.getNombre() );
        usuarioDTO.apellido( usuario.getApellido() );
        usuarioDTO.email( usuario.getEmail() );
        usuarioDTO.dependencia( usuario.getDependencia() );
        usuarioDTO.contrasena( usuario.getContrasena() );

        return usuarioDTO.build();
    }

    @Override
    public Usuario toEntity(UsuarioDTO usuarioDTO) {
        if ( usuarioDTO == null ) {
            return null;
        }

        Usuario usuario = new Usuario();

        usuario.setId( usuarioDTO.getId() );
        usuario.setRol( usuarioDTO.getRol() );
        usuario.setNombre( usuarioDTO.getNombre() );
        usuario.setApellido( usuarioDTO.getApellido() );
        usuario.setEmail( usuarioDTO.getEmail() );
        usuario.setRequiereCambioContrasena( usuarioDTO.isRequiereCambioContrasena() );
        usuario.setRequiere2FA( usuarioDTO.isRequiere2FA() );
        usuario.setSecret2FA( usuarioDTO.getSecret2FA() );
        usuario.setDependencia( usuarioDTO.getDependencia() );

        return usuario;
    }

    @Override
    public Usuario updateEntity(UsuarioDTO usuarioDTO, Usuario usuario) {
        if ( usuarioDTO == null ) {
            return usuario;
        }

        usuario.setId( usuarioDTO.getId() );
        usuario.setRol( usuarioDTO.getRol() );
        usuario.setNombre( usuarioDTO.getNombre() );
        usuario.setApellido( usuarioDTO.getApellido() );
        usuario.setEmail( usuarioDTO.getEmail() );
        usuario.setContrasena( usuarioDTO.getContrasena() );
        usuario.setRequiereCambioContrasena( usuarioDTO.isRequiereCambioContrasena() );
        usuario.setRequiere2FA( usuarioDTO.isRequiere2FA() );
        usuario.setSecret2FA( usuarioDTO.getSecret2FA() );
        usuario.setDependencia( usuarioDTO.getDependencia() );

        return usuario;
    }

    private Long usuarioCreadoPorId(Usuario usuario) {
        if ( usuario == null ) {
            return null;
        }
        Usuario creadoPor = usuario.getCreadoPor();
        if ( creadoPor == null ) {
            return null;
        }
        Long id = creadoPor.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
