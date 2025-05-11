package com.cufre.expedientes.config;

import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.JDBCConnectionException;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.dao.DataIntegrityViolationException;
import org.hibernate.exception.ConstraintViolationException;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@ControllerAdvice
public class DataSourceExceptionHandler {

    @ExceptionHandler({DataAccessException.class, SQLException.class, JDBCConnectionException.class, DataIntegrityViolationException.class})
    public ResponseEntity<Object> handleDatabaseException(Exception ex) {
        log.error("Error de conexión a la base de datos: {}", ex.getMessage(), ex);
        
        Map<String, Object> response = new HashMap<>();

        // Manejo específico para restricción única de expediente-delito
        Throwable cause = ex.getCause();
        if (cause instanceof ConstraintViolationException cve && cve.getConstraintName() != null && cve.getConstraintName().contains("UK_EXPEDIENTE_DELITO")) {
            response.put("tipo", "Asociación duplicada");
            response.put("mensaje", "El delito ya está asociado a este expediente.");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        if (ex.getMessage() != null && ex.getMessage().contains("UK_EXPEDIENTE_DELITO")) {
            response.put("tipo", "Asociación duplicada");
            response.put("mensaje", "El delito ya está asociado a este expediente.");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }

        response.put("error", "Error de conexión a la base de datos");
        response.put("mensaje", "Se ha producido un error al conectar con la base de datos. Por favor, contacte al administrador.");
        response.put("detalle", ex.getMessage());
        
        // Determinar el tipo de error para un mejor mensaje
        if (ex instanceof JDBCConnectionException) {
            response.put("tipo", "Error de conexión JDBC");
        } else if (ex instanceof SQLException) {
            SQLException sqlEx = (SQLException) ex;
            response.put("tipo", "Error SQL");
            response.put("código SQL", sqlEx.getErrorCode());
            response.put("estado SQL", sqlEx.getSQLState());
        } else {
            response.put("tipo", "Error de acceso a datos");
        }
        
        return new ResponseEntity<>(response, HttpStatus.SERVICE_UNAVAILABLE);
    }
} 