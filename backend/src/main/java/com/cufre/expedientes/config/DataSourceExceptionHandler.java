package com.cufre.expedientes.config;

import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.JDBCConnectionException;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@ControllerAdvice
public class DataSourceExceptionHandler {

    @ExceptionHandler({DataAccessException.class, SQLException.class, JDBCConnectionException.class})
    public ResponseEntity<Object> handleDatabaseException(Exception ex) {
        log.error("Error de conexión a la base de datos: {}", ex.getMessage(), ex);
        
        Map<String, Object> response = new HashMap<>();
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