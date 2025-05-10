package com.cufre.expedientes.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Clase utilitaria para generar hashes de contraseñas
 * Ejecute el método main para obtener el hash BCrypt de "Minseg2025-"
 */
public class PasswordHashGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "Minseg2025-";
        String hashedPassword = encoder.encode(password);
        
        System.out.println("Password: " + password);
        System.out.println("Hashed Password: " + hashedPassword);
    }
} 