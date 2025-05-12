package com.cufre.expedientes.repository;

import com.cufre.expedientes.model.ActividadSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActividadSistemaRepository extends JpaRepository<ActividadSistema, Long> {
    // Aquí se pueden agregar métodos de consulta personalizados si es necesario
} 