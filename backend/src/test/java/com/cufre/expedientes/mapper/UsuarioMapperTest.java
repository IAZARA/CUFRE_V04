package com.cufre.expedientes.mapper;

import com.cufre.expedientes.dto.UsuarioDTO;
import com.cufre.expedientes.model.Usuario;
import com.cufre.expedientes.model.enums.Rol;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
public class UsuarioMapperTest {

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Test
    public void testToDto() {
        // Crear un usuario con datos de prueba
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setApellido("Perez");
        usuario.setRol(Rol.ADMINISTRADOR);
        usuario.setDependencia("Departamento de Sistemas");
        usuario.setContrasena("passwordEncriptada");

        // Convertir a DTO
        UsuarioDTO dto = usuarioMapper.toDto(usuario);

        // Verificar los resultados
        assertEquals(1L, dto.getId());
        assertEquals("Juan", dto.getNombre());
        assertEquals("Perez", dto.getApellido());
        assertEquals(Rol.ADMINISTRADOR, dto.getRol());
        assertEquals("Departamento de Sistemas", dto.getDependencia());
        // La contraseña no se debe mapear al DTO
    }

    @Test
    public void testToEntity() {
        // Crear un DTO con datos de prueba
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(1L);
        dto.setNombre("Juan");
        dto.setApellido("Perez");
        dto.setRol(Rol.ADMINISTRADOR);
        dto.setDependencia("Departamento de Sistemas");
        dto.setCreadoPorId(2L);

        // Convertir a entidad
        Usuario usuario = usuarioMapper.toEntity(dto);

        // Verificar los resultados
        assertEquals(1L, usuario.getId());
        assertEquals("Juan", usuario.getNombre());
        assertEquals("Perez", usuario.getApellido());
        assertEquals(Rol.ADMINISTRADOR, usuario.getRol());
        assertEquals("Departamento de Sistemas", usuario.getDependencia());
        // creadoPor y contraseña deben ser null ya que se ignoran
        assertNull(usuario.getContrasena());
        assertNull(usuario.getCreadoPor());
    }
} 