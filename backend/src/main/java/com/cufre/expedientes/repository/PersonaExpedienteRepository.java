package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.PersonaExpediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaExpedienteRepository extends JpaRepository<PersonaExpediente, Long> {
    
    List<PersonaExpediente> findByPersonaId(Long personaId);
    
    List<PersonaExpediente> findByExpedienteId(Long expedienteId);
    
    List<PersonaExpediente> findByTipoRelacion(String tipoRelacion);
    
    List<PersonaExpediente> findByPersonaIdAndTipoRelacion(Long personaId, String tipoRelacion);
    
    List<PersonaExpediente> findByExpedienteIdAndTipoRelacion(Long expedienteId, String tipoRelacion);
    
    // Estadísticas
    @Query("SELECT pe.tipoRelacion, COUNT(pe) FROM PersonaExpediente pe GROUP BY pe.tipoRelacion ORDER BY COUNT(pe) DESC")
    List<Object[]> countByTipoRelacion();
    
    @Query("SELECT COUNT(DISTINCT pe.persona.id) FROM PersonaExpediente pe WHERE pe.tipoRelacion = :tipoRelacion")
    Long countDistinctPersonasByTipoRelacion(@Param("tipoRelacion") String tipoRelacion);
} 