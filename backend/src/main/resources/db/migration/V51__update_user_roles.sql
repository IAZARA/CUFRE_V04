-- Actualización de roles de usuario
-- V4__update_user_roles.sql

-- Actualizar el rol del administrador de 'ADMIN' a 'ADMINISTRADOR'
UPDATE USUARIO SET ROL = 'ADMINISTRADOR' WHERE ROL = 'ADMIN';

-- Añadir un usuario para cada tipo de rol solo si no existe ya
-- SUPERUSUARIO
BEGIN
  DECLARE
    v_count NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_count FROM USUARIO WHERE EMAIL = 'super.usuario@cufre.com';
    
    -- Solo insertar si no existe
    IF v_count = 0 THEN
      INSERT INTO USUARIO (ID, ROL, NOMBRE, APELLIDO, CONTRASENA, DEPENDENCIA, EMAIL)
      VALUES (SEQ_USUARIO.NEXTVAL, 'SUPERUSUARIO', 'Super', 'Usuario', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'SISTEMA', 'super.usuario@cufre.com');
    END IF;
  END;
END;
/

-- USUARIOCARGA
BEGIN
  DECLARE
    v_count NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_count FROM USUARIO WHERE EMAIL = 'usuario.carga@cufre.com';
    
    IF v_count = 0 THEN
      INSERT INTO USUARIO (ID, ROL, NOMBRE, APELLIDO, CONTRASENA, DEPENDENCIA, EMAIL)
      VALUES (SEQ_USUARIO.NEXTVAL, 'USUARIOCARGA', 'Usuario', 'Carga', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'AREA CARGA', 'usuario.carga@cufre.com');
    END IF;
  END;
END;
/

-- USUARIOCONSULTA
BEGIN
  DECLARE
    v_count NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_count FROM USUARIO WHERE EMAIL = 'usuario.consulta@cufre.com';
    
    IF v_count = 0 THEN
      INSERT INTO USUARIO (ID, ROL, NOMBRE, APELLIDO, CONTRASENA, DEPENDENCIA, EMAIL)
      VALUES (SEQ_USUARIO.NEXTVAL, 'USUARIOCONSULTA', 'Usuario', 'Consulta', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'AREA CONSULTA', 'usuario.consulta@cufre.com');
    END IF;
  END;
END;
/

-- Intentar eliminar el constraint si existe antes de crearlo
BEGIN
  FOR c IN (SELECT constraint_name 
            FROM user_constraints 
            WHERE table_name = 'USUARIO' 
            AND constraint_type = 'C'
            AND constraint_name LIKE '%CHK_ROL%') LOOP
    -- Intentar eliminar
    BEGIN
      EXECUTE IMMEDIATE 'ALTER TABLE USUARIO DROP CONSTRAINT ' || c.constraint_name;
    EXCEPTION
      WHEN OTHERS THEN
        NULL; -- Ignorar errores
    END;
  END LOOP;
END;
/

-- Agregar constraint CHECK para validar roles
ALTER TABLE USUARIO ADD CONSTRAINT CHK_ROL CHECK (
    ROL IN ('SUPERUSUARIO', 'ADMINISTRADOR', 'USUARIOCARGA', 'USUARIOCONSULTA')
);

-- Commit para aplicar los cambios
COMMIT; 