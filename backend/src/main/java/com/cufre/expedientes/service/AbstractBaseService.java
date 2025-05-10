package com.cufre.expedientes.service;

import com.cufre.expedientes.exception.ResourceNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación abstracta de BaseService que proporciona operaciones CRUD comunes.
 *
 * @param <T> El tipo de entidad
 * @param <D> El tipo de DTO
 * @param <ID> El tipo de ID
 * @param <R> El tipo de repositorio
 * @param <M> El tipo de mapper
 */
public abstract class AbstractBaseService<T, D, ID, R extends JpaRepository<T, ID>, M> implements BaseService<T, D, ID> {
    
    protected final R repository;
    protected final M mapper;
    
    protected AbstractBaseService(R repository, M mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }
    
    /**
     * Convierte una entidad a DTO
     */
    protected abstract D toDto(T entity);
    
    /**
     * Convierte un DTO a entidad
     */
    protected abstract T toEntity(D dto);
    
    /**
     * Actualiza una entidad existente con datos del DTO
     */
    protected abstract T updateEntity(D dto, T entity);
    
    /**
     * Obtiene el nombre de la entidad para mensajes de error
     */
    protected abstract String getEntityName();
    
    @Override
    @Transactional(readOnly = true)
    public List<D> findAll() {
        return repository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public D findById(ID id) {
        T entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(getEntityName() + " no encontrado con id: " + id));
        return toDto(entity);
    }
    
    @Override
    @Transactional
    public D save(D dto) {
        T entity = toEntity(dto);
        entity = repository.save(entity);
        return toDto(entity);
    }
    
    @Override
    @Transactional
    public D update(ID id, D dto) {
        return repository.findById(id)
                .map(entity -> {
                    T updatedEntity = updateEntity(dto, entity);
                    updatedEntity = repository.save(updatedEntity);
                    return toDto(updatedEntity);
                })
                .orElseThrow(() -> new ResourceNotFoundException(getEntityName() + " no encontrado con id: " + id));
    }
    
    @Override
    @Transactional
    public void delete(ID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(getEntityName() + " no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
} 