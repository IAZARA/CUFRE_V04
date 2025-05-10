package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.ExpedienteDelito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpedienteDelitoRepository extends JpaRepository<ExpedienteDelito, Long> {
    
    List<ExpedienteDelito> findByExpedienteId(Long expedienteId);
    
    List<ExpedienteDelito> findByDelitoId(Long delitoId);
    
    // Estadísticas
    @Query("SELECT ed.delito.nombre, COUNT(ed) FROM ExpedienteDelito ed GROUP BY ed.delito.nombre ORDER BY COUNT(ed) DESC")
    List<Object[]> countByDelito();
    
    @Query("SELECT COUNT(DISTINCT ed.expediente.id) FROM ExpedienteDelito ed WHERE ed.delito.id = :delitoId")
    Long countExpedientesByDelito(@Param("delitoId") Long delitoId);
} 