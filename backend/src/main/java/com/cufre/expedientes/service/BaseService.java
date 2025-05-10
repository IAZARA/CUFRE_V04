package com.cufre.expedientes.service;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz base para servicios que proporcionan operaciones CRUD.
 *
 * @param <T> El tipo de entidad
 * @param <D> El tipo de DTO
 * @param <ID> El tipo de ID
 */
public interface BaseService<T, D, ID> {
    
    /**
     * Obtiene todos los registros
     * @return Lista de DTOs
     */
    List<D> findAll();
    
    /**
     * Busca un registro por ID
     * @param id El ID del registro
     * @return DTO del registro encontrado
     */
    D findById(ID id);
    
    /**
     * Guarda un nuevo registro
     * @param dto El DTO con la información a guardar
     * @return DTO del registro guardado
     */
    D save(D dto);
    
    /**
     * Actualiza un registro existente
     * @param id El ID del registro a actualizar
     * @param dto El DTO con la información actualizada
     * @return DTO del registro actualizado
     */
    D update(ID id, D dto);
    
    /**
     * Elimina un registro por ID
     * @param id El ID del registro a eliminar
     */
    void delete(ID id);
} 