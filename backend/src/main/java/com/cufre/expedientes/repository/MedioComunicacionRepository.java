package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.MedioComunicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedioComunicacionRepository extends JpaRepository<MedioComunicacion, Long> {
    
    /**
     * Encuentra medios de comunicación por ID de persona
     */
    List<MedioComunicacion> findByPersonaId(Long personaId);
    
    /**
     * Encuentra medios de comunicación por tipo
     */
    List<MedioComunicacion> findByTipo(String tipo);
    
    List<MedioComunicacion> findByTipoAndPersonaId(String tipo, Long personaId);
    
    /**
     * Encuentra medios de comunicación que contienen un valor específico
     */
    List<MedioComunicacion> findByValorContainingIgnoreCase(String valor);
} 