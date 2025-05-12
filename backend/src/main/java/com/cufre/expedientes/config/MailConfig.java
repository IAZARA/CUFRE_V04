package com.cufre.expedientes.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

/**
 * Configuración personalizada para el servicio de correo electrónico
 */
@Configuration
public class MailConfig {

    @Value("${spring.mail.host:#{null}}")
    private String host;

    @Value("${spring.mail.port:0}")
    private int port;

    @Value("${spring.mail.username:#{null}}")
    private String username;

    @Value("${spring.mail.password:#{null}}")
    private String password;

    @Bean
    public JavaMailSender javaMailSender() {
        // Si alguna configuración esencial falta, retornar null para que sea opcional
        if (host == null || host.isEmpty() || port == 0 || username == null || username.isEmpty() || password == null || password.isEmpty()) {
            System.out.println("Configuración de correo incompleta. El servicio de correo estará desactivado.");
            return null;
        }

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.debug", "true");
        props.put("mail.smtp.connectiontimeout", "30000");
        props.put("mail.smtp.timeout", "30000");
        props.put("mail.smtp.writetimeout", "30000");

        return mailSender;
    }
}