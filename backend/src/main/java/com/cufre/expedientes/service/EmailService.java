package com.cufre.expedientes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarBienvenida(String nombre, String apellido, String email) throws MessagingException {
        String password = "Minseg2025-"; // Contraseña inicial fija

        String asunto = "Bienvenido al Sistema CUFRE";
        String html = "<div style=\"font-family: Arial, sans-serif; border:1px solid #e0e0e0; border-radius:8px; padding:32px; background:#fff;\">"
                + "<h2 style=\"color:#174ea6; text-align:center; margin-top:0;\">Bienvenido al Sistema CUFRE</h2>"
                + "<p>Estimado/a <b>" + nombre + " " + apellido + "</b>,</p>"
                + "<p>Te damos la bienvenida al <b>Comando Unificado Federal de Recaptura de Evadidos (CUFRE)</b>. Tu cuenta ha sido creada exitosamente y ya puedes comenzar a utilizar el sistema.</p>"
                + "<div style=\"background:#f5f8fa; border-radius:6px; padding:18px 24px; margin:24px 0;\">"
                + "<h3 style=\"color:#174ea6; margin-top:0;\">Tus credenciales de acceso</h3>"
                + "<p><b>Usuario:</b> <a href=\"mailto:" + email + "\">" + email + "</a></p>"
                + "<p><b>Contraseña inicial:</b> " + password + "</p>"
                + "</div>"
                + "<p><b>Importante:</b> Por razones de seguridad, deberás cambiar tu contraseña en el primer inicio de sesión y configurar la autenticación de dos factores (2FA).</p>"
                + "<p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar al administrador del sistema.</p>"
                + "<hr style=\"margin:32px 0 16px 0; border:none; border-top:1px solid #e0e0e0;\">"
                + "<p style=\"color:#888; font-size:13px;\">Este es un mensaje automático, por favor no respondas a este correo.</p>"
                + "<p style=\"color:#888; font-size:13px;\">© 2025 Sistema CUFRE - Dirección Nacional de Gestión de Bases de Datos de Seguridad - Ministerio de Seguridad Nacional</p>"
                + "</div>";

        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
        helper.setFrom("soporte.cufre@gmail.com");
        helper.setTo(email);
        helper.setSubject(asunto);
        helper.setText(html, true);

        mailSender.send(mensaje);
    }
} 