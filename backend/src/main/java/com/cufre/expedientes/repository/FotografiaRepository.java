package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.Fotografia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FotografiaRepository extends JpaRepository<Fotografia, Long> {
    
    /**
     * Encuentra fotografías por ID de expediente
     */
    List<Fotografia> findByExpedienteId(Long expedienteId);
    
    /**
     * Encuentra fotografías por descripción (parcial e insensible a mayúsculas/minúsculas)
     */
    List<Fotografia> findByDescripcionContainingIgnoreCase(String descripcion);
    
    List<Fotografia> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);
} 