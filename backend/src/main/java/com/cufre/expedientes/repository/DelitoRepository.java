package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.Delito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DelitoRepository extends JpaRepository<Delito, Long> {
    
    /**
     * Encuentra delitos por nombre (parcial e insensible a mayúsculas/minúsculas)
     */
    List<Delito> findByNombreContainingIgnoreCase(String nombre);
    
    /**
     * Encuentra delitos por código del Código Penal (parcial e insensible a mayúsculas/minúsculas)
     */
    List<Delito> findByCodigoPenalContainingIgnoreCase(String codigoCP);
    
    List<Delito> findByTipoPena(String tipoPena);
    
    List<Delito> findByValoracionGreaterThanEqual(Integer valoracionMinima);
    
    /**
     * Encuentra delitos asociados a un expediente
     */
    @Query("SELECT d FROM Delito d JOIN d.expedienteDelitos ed WHERE ed.expediente.id = :expedienteId")
    List<Delito> findByExpedienteId(@Param("expedienteId") Long expedienteId);
    
    // Estadísticas
    @Query("SELECT d.nombre, COUNT(ed.expediente) FROM Delito d JOIN d.expedienteDelitos ed GROUP BY d.nombre ORDER BY COUNT(ed.expediente) DESC")
    List<Object[]> findDelitosMasFrecuentes();
    
    @Query("SELECT d.tipoPena, COUNT(d) FROM Delito d GROUP BY d.tipoPena ORDER BY COUNT(d) DESC")
    List<Object[]> countByTipoPena();
} 