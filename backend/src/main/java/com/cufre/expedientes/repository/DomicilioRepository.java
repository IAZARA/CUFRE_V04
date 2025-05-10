package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.Domicilio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DomicilioRepository extends JpaRepository<Domicilio, Long> {
    
    /**
     * Encuentra domicilios por ID de persona
     */
    List<Domicilio> findByPersonaId(Long personaId);
    
    /**
     * Encuentra domicilios por provincia (parcial e insensible a mayúsculas/minúsculas)
     */
    List<Domicilio> findByProvinciaContainingIgnoreCase(String provincia);
    
    /**
     * Encuentra domicilios por localidad (parcial e insensible a mayúsculas/minúsculas)
     */
    List<Domicilio> findByLocalidadContainingIgnoreCase(String localidad);
    
    List<Domicilio> findByBarrio(String barrio);
    
    List<Domicilio> findByPais(String pais);
    
    List<Domicilio> findByTipo(String tipo);
    
    List<Domicilio> findByEsPrincipal(Boolean esPrincipal);
    
    @Query("SELECT d FROM Domicilio d WHERE d.calle LIKE %:texto% OR d.localidad LIKE %:texto% OR d.provincia LIKE %:texto%")
    List<Domicilio> buscarPorTexto(@Param("texto") String texto);
} 