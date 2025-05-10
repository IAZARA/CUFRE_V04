package com.cufre.expedientes.controller;

import com.cufre.expedientes.service.BaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Controlador base abstracto que proporciona operaciones CRUD.
 *
 * @param <T> El tipo de entidad
 * @param <D> El tipo de DTO
 * @param <ID> El tipo de ID
 */
public abstract class AbstractBaseController<T, D, ID> {
    protected final BaseService<T, D, ID> service;
    
    protected AbstractBaseController(BaseService<T, D, ID> service) {
        this.service = service;
    }
    
    @GetMapping
    public ResponseEntity<List<D>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<D> getById(@PathVariable ID id) {
        return ResponseEntity.ok(service.findById(id));
    }
    
    @PostMapping
    public ResponseEntity<D> create(@Valid @RequestBody D dto) {
        D created = service.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<D> update(@PathVariable ID id, @Valid @RequestBody D dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
} 