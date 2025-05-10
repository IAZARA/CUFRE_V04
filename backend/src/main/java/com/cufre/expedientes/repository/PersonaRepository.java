package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {
    
    Optional<Persona> findByTipoDocumentoAndNumeroDocumento(String tipoDocumento, String numeroDocumento);
    
    List<Persona> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String nombre, String apellido);
    
    List<Persona> findByNacionalidad(String nacionalidad);
    
    @Query("SELECT p FROM Persona p JOIN p.personaExpedientes pe WHERE pe.expediente.id = :expedienteId")
    List<Persona> findByExpedienteId(@Param("expedienteId") Long expedienteId);
    
    @Query("SELECT p FROM Persona p JOIN p.personaExpedientes pe WHERE pe.expediente.id = :expedienteId AND pe.tipoRelacion = :tipoRelacion")
    List<Persona> findByExpedienteAndTipoRelacion(@Param("expedienteId") Long expedienteId, @Param("tipoRelacion") String tipoRelacion);
    
    @Query("SELECT p FROM Persona p JOIN p.domicilios d WHERE d.provincia = :provincia")
    List<Persona> findByProvincia(@Param("provincia") String provincia);
    
    @Query("SELECT p FROM Persona p JOIN p.mediosComunicacion m WHERE m.tipo = :tipo AND m.valor LIKE %:valor%")
    List<Persona> findByMedioComunicacion(@Param("tipo") String tipo, @Param("valor") String valor);

    /**
     * Encuentra personas por número de documento
     */
    List<Persona> findByNumeroDocumento(String numeroDocumento);

    /**
     * Encuentra personas por domicilio
     */
    @Query("SELECT p FROM Persona p JOIN p.domicilios d WHERE d.calle LIKE %:calle% OR d.localidad LIKE %:localidad% OR d.provincia LIKE %:provincia%")
    List<Persona> findByDomicilio(@Param("calle") String calle, @Param("localidad") String localidad, @Param("provincia") String provincia);
} 