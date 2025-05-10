-- Script para crear un usuario en la aplicación CUFRE
-- Para ejecutar: sqlplus cufre_user/Cufre-2025@localhost:1521/XE @scripts/crear-usuario.sql

-- Variables para el usuario
DEFINE email = 'ivan.zarate@minseg.gob.ar'
DEFINE nombre = 'Ivan'
DEFINE apellido = 'Zarate'
DEFINE rol = 'SUPERUSUARIO'
-- Contraseña: Minseg2025-
-- La contraseña está codificada con BCrypt, ya que Spring Security usa PasswordEncoder
DEFINE password_hash = '$2a$10$rnJJL.RLA9DJWLHxZRqr5OaG.hqMWuLqAEA3Dx/9eKdHCX9KLqpg2'

-- Verificar si existe la tabla USUARIO
DECLARE
    v_table_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_table_exists 
    FROM user_tables 
    WHERE table_name = 'USUARIO';
    
    IF v_table_exists = 0 THEN
        DBMS_OUTPUT.PUT_LINE('La tabla USUARIO no existe. Debe ejecutar la aplicación para crear las tablas.');
        DBMS_OUTPUT.PUT_LINE('Ejecute: ./iniciar-con-oracle.sh');
        RETURN;
    END IF;
    
    -- Si la tabla existe, proceder con la inserción del usuario
    DECLARE
        v_count NUMBER;
        v_email VARCHAR2(150) := '&email';
    BEGIN
        SELECT COUNT(*) INTO v_count FROM USUARIO WHERE EMAIL = v_email;
        
        IF v_count > 0 THEN
            DBMS_OUTPUT.PUT_LINE('El usuario con email ' || v_email || ' ya existe.');
        ELSE
            -- Insertar el nuevo usuario
            INSERT INTO USUARIO (
                ROL,
                NOMBRE,
                APELLIDO,
                EMAIL,
                CONTRASENA
            ) VALUES (
                '&rol',
                '&nombre',
                '&apellido',
                '&email',
                '&password_hash'
            );
            
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Usuario creado correctamente: ' || v_email);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error al crear el usuario: ' || SQLERRM);
            ROLLBACK;
    END;
END;
/

-- Verificar que el usuario se haya creado correctamente
SELECT ID, NOMBRE, APELLIDO, EMAIL, ROL FROM USUARIO WHERE EMAIL = '&email';

-- Limpiar variables
UNDEFINE email
UNDEFINE nombre
UNDEFINE apellido
UNDEFINE rol
UNDEFINE password_hash 