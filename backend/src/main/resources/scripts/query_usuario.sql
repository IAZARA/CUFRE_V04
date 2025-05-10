-- Consulta para verificar si Ivan Zarate existe en la tabla USUARIO
SELECT 
    ID, 
    NOMBRE, 
    APELLIDO, 
    EMAIL, 
    ROL, 
    DEPENDENCIA
FROM 
    USUARIO 
WHERE 
    EMAIL = 'ivan.zarate@minseg.gob.ar'; 