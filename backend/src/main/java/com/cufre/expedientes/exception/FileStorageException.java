package com.cufre.expedientes.exception;

/**
 * Excepción lanzada cuando ocurre un error en el almacenamiento de archivos.
 */
public class FileStorageException extends RuntimeException {

    public FileStorageException(String message) {
        super(message);
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
} 