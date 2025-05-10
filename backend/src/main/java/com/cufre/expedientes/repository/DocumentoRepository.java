package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {
    
    List<Documento> findByExpedienteId(Long expedienteId);
    
    List<Documento> findByTipo(String tipo);
    
    List<Documento> findByDescripcionContainingIgnoreCase(String descripcion);
    
    List<Documento> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);
    
    List<Documento> findByTipoAndExpedienteId(String tipo, Long expedienteId);
} 