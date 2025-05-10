package com.cufre.expedientes.security;

import com.cufre.expedientes.dto.LoginDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Filtro para autenticar usuarios con email/contraseña y generar un token JWT.
 */
@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
        setFilterProcessesUrl("/api/auth/login"); // Establecer la URL para el procesamiento de autenticación
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) 
            throws AuthenticationException {
        try {
            log.debug("Intentando autenticar usuario");
            
            // Leer el objeto LoginDTO desde el cuerpo de la solicitud
            LoginDTO loginDTO = new ObjectMapper().readValue(request.getInputStream(), LoginDTO.class);
            log.debug("Usuario intentando autenticarse: {}", loginDTO.getEmail());
            
            // Crear token de autenticación con las credenciales recibidas
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    loginDTO.getEmail(), loginDTO.getPassword());
            
            // Intentar autenticación con AuthenticationManager
            return getAuthenticationManager().authenticate(authToken);
        } catch (IOException e) {
            log.error("Error al leer credenciales: {}", e.getMessage());
            throw new RuntimeException("Error al leer credenciales", e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, 
            FilterChain chain, Authentication authentication) throws IOException, ServletException {
        try {
            // Obtener detalles del usuario autenticado
            User userDetails = (User) authentication.getPrincipal();
            log.debug("Autenticación exitosa para usuario: {}", userDetails.getUsername());
            
            // Generar el token JWT
            String token = jwtTokenProvider.generateToken(authentication);
            
            // Preparar respuesta
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("token", token);
            responseBody.put("usuario", userDetails.getUsername());
            responseBody.put("roles", userDetails.getAuthorities());
            
            // Configurar encabezados de respuesta
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            
            // Escribir respuesta
            new ObjectMapper().writeValue(response.getOutputStream(), responseBody);
            
            // Actualizar contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception e) {
            log.error("Error en autenticación exitosa: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> error = new HashMap<>();
            error.put("mensaje", "Error al procesar la autenticación");
            error.put("error", e.getMessage());
            response.getWriter().write(new ObjectMapper().writeValueAsString(error));
        }
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, 
            AuthenticationException failed) throws IOException, ServletException {
        log.error("Autenticación fallida: {}", failed.getMessage());
        
        // Configurar respuesta de error
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Preparar cuerpo de respuesta
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("mensaje", "Credenciales incorrectas");
        errorDetails.put("error", failed.getMessage());
        
        // Escribir respuesta
        new ObjectMapper().writeValue(response.getOutputStream(), errorDetails);
    }
} 