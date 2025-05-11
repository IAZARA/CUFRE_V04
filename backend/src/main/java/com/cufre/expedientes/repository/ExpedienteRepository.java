package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.Expediente;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpedienteRepository extends JpaRepository<Expediente, Long> {
    
    Optional<Expediente> findByNumero(String numero);
    
    List<Expediente> findByFechaIngresoBetween(LocalDate fechaInicio, LocalDate fechaFin);
    
    List<Expediente> findByEstadoSituacion(String estadoSituacion);
    
    List<Expediente> findByFuerzaAsignada(String fuerzaAsignada);
    
    List<Expediente> findByPrioridadGreaterThanEqual(Integer prioridadMinima);
    
    @Query("SELECT e FROM Expediente e JOIN e.personaExpedientes pe WHERE pe.persona.id = :personaId AND pe.tipoRelacion = :tipoRelacion")
    List<Expediente> findByPersonaAndTipoRelacion(@Param("personaId") Long personaId, @Param("tipoRelacion") String tipoRelacion);
    
    @Query("SELECT e FROM Expediente e JOIN e.expedienteDelitos ed WHERE ed.delito.id = :delitoId")
    List<Expediente> findByDelito(@Param("delitoId") Long delitoId);
    
    @Query("SELECT e FROM Expediente e WHERE e.provincia = :provincia")
    List<Expediente> findByProvincia(@Param("provincia") String provincia);
    
    // Consultas para estadísticas
    @Query("SELECT COUNT(e) FROM Expediente e WHERE e.fechaIngreso BETWEEN :fechaInicio AND :fechaFin")
    Long countByPeriodo(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
    
    @Query("SELECT e.provincia, COUNT(e) FROM Expediente e GROUP BY e.provincia ORDER BY COUNT(e) DESC")
    List<Object[]> countByProvincia();

    @Query("SELECT e.estadoSituacion, COUNT(e) FROM Expediente e GROUP BY e.estadoSituacion ORDER BY COUNT(e) DESC")
    List<Object[]> countByEstadoSituacion();
    
    @Query("SELECT e.tipoCaptura, COUNT(e) FROM Expediente e GROUP BY e.tipoCaptura ORDER BY COUNT(e) DESC")
    List<Object[]> countByTipoCaptura();
    
    @Query("SELECT FUNCTION('YEAR', e.fechaIngreso) as anio, COUNT(e) FROM Expediente e GROUP BY anio ORDER BY anio")
    List<Object[]> countByAnio();
    
    @Query("SELECT FUNCTION('MONTH', e.fechaIngreso) as mes, COUNT(e) FROM Expediente e WHERE FUNCTION('YEAR', e.fechaIngreso) = :anio GROUP BY mes ORDER BY mes")
    List<Object[]> countByMesEnAnio(@Param("anio") Integer anio);
    
    @Query("SELECT COUNT(e) FROM Expediente e WHERE e.fechaDetencion IS NOT NULL")
    Long countCapturados();
    
    @Query("SELECT COUNT(e) FROM Expediente e WHERE e.fechaDetencion IS NULL")
    Long countNoCapturados();

    /**
     * Encuentra expedientes que contienen un número de expediente (búsqueda parcial e insensible a mayúsculas/minúsculas)
     */
    List<Expediente> findByNumeroContainingIgnoreCase(String numeroExpediente);

    /**
     * Encuentra expedientes asociados a una persona
     */
    @Query("SELECT e FROM Expediente e JOIN e.personaExpedientes pe WHERE pe.persona.id = :personaId")
    List<Expediente> findByPersonaId(@Param("personaId") Long personaId);

    /**
     * Encuentra expedientes asociados a un delito
     */
    @Query("SELECT e FROM Expediente e JOIN e.expedienteDelitos ed WHERE ed.delito.id = :delitoId")
    List<Expediente> findByDelitoId(@Param("delitoId") Long delitoId);

    /**
     * Cuenta expedientes entre dos fechas
     */
    long countByFechaIngresoBetween(LocalDate fechaInicio, LocalDate fechaFin);
    
    /**
     * Encuentra un expediente por ID sin cargar sus relaciones
     * Esto evita el error MultipleBagFetchException
     */
    @Query("SELECT e FROM Expediente e WHERE e.id = :id")
    Optional<Expediente> findByIdWithRelations(@Param("id") Long id);
    
    /**
     * Carga las fotografías de un expediente
     */
    @Query("SELECT f FROM Expediente e JOIN e.fotografias f WHERE e.id = :expedienteId")
    List<com.cufre.expedientes.model.Fotografia> findFotografiasByExpedienteId(@Param("expedienteId") Long expedienteId);
    
    /**
     * Carga los documentos de un expediente
     */
    @Query("SELECT d FROM Expediente e JOIN e.documentos d WHERE e.id = :expedienteId")
    List<com.cufre.expedientes.model.Documento> findDocumentosByExpedienteId(@Param("expedienteId") Long expedienteId);
    
    /**
     * Carga las personas asociadas a un expediente
     */
    @Query("SELECT pe FROM Expediente e JOIN e.personaExpedientes pe WHERE e.id = :expedienteId")
    List<com.cufre.expedientes.model.PersonaExpediente> findPersonaExpedientesByExpedienteId(@Param("expedienteId") Long expedienteId);
    
    /**
     * Carga los delitos asociados a un expediente
     */
    @Query("SELECT ed FROM Expediente e JOIN e.expedienteDelitos ed WHERE e.id = :expedienteId")
    List<com.cufre.expedientes.model.ExpedienteDelito> findExpedienteDelitosByExpedienteId(@Param("expedienteId") Long expedienteId);
    
    /**
     * Cuenta los expedientes por un estado de situación específico
     */
    @Query("SELECT COUNT(e) FROM Expediente e WHERE e.estadoSituacion = :estado")
    Long countByEstadoSituacionEquals(@Param("estado") String estado);

    List<Expediente> findAllByOrderByPrioridadAsc(Pageable pageable);

    List<Expediente> findAllByEstadoSituacionAndOrderByPrioridadAsc(String estadoSituacion, Pageable pageable);
} 