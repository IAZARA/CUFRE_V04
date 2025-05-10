package com.cufre.expedientes.security;

/*
 * CLASE COMENTADA PARA EVITAR CONFLICTOS
 * La configuración de seguridad se maneja ahora en WebSecurityConfig
 *
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfigLegacy {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Configuración básica para desarrollo
        // En producción, se implementará JWT y se deshabilitará el acceso a endpoints sin autenticación
        http
            .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF para APIs REST
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/**").permitAll() // Endpoints públicos de autenticación
                .requestMatchers(HttpMethod.GET, "/api/expedientes/public/**").permitAll() // Endpoints públicos de solo lectura
                .requestMatchers("/actuator/**").permitAll() // Endpoints de monitoreo
                .requestMatchers("/api/**").authenticated() // Resto de endpoints protegidos
            )
            .httpBasic(httpBasic -> {}) // Autenticación básica para desarrollo
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Sin estado para APIs REST
            );
            
        return http.build();
    }
}
*/

// Clase vacía para mantener el archivo
public class SecurityConfigLegacy {
    // Esta clase está deshabilitada
} 