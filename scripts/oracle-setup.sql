-- Script para configurar Oracle Database
-- Debe ejecutarse con un usuario que tenga permisos de administrador (SYS o SYSTEM)

-- Verificar si el usuario ya existe
DECLARE
    v_count NUMBER;
    v_username VARCHAR2(30) := 'CUFRE_USER';
BEGIN
    SELECT COUNT(*) INTO v_count FROM dba_users WHERE username = v_username;
    
    IF v_count = 0 THEN
        -- Crear usuario si no existe
        EXECUTE IMMEDIATE 'CREATE USER ' || v_username || ' IDENTIFIED BY "Cufre-2025"';
        EXECUTE IMMEDIATE 'GRANT CONNECT, RESOURCE TO ' || v_username;
        EXECUTE IMMEDIATE 'GRANT CREATE SESSION TO ' || v_username;
        EXECUTE IMMEDIATE 'GRANT CREATE TABLE TO ' || v_username;
        EXECUTE IMMEDIATE 'GRANT CREATE VIEW TO ' || v_username;
        EXECUTE IMMEDIATE 'GRANT CREATE SEQUENCE TO ' || v_username;
        EXECUTE IMMEDIATE 'GRANT CREATE PROCEDURE TO ' || v_username;
        EXECUTE IMMEDIATE 'GRANT CREATE TRIGGER TO ' || v_username;
        EXECUTE IMMEDIATE 'GRANT UNLIMITED TABLESPACE TO ' || v_username;
        
        DBMS_OUTPUT.PUT_LINE('Usuario ' || v_username || ' creado correctamente con todos los permisos necesarios.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('El usuario ' || v_username || ' ya existe.');
    END IF;
END;
/

-- Verificar tablas existentes en el esquema
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count 
    FROM all_tables 
    WHERE owner = 'CUFRE_USER';
    
    DBMS_OUTPUT.PUT_LINE('Número de tablas existentes en el esquema CUFRE_USER: ' || v_count);
END;
/

-- Instrucciones para el usuario:
/*
INSTRUCCIONES:

1. Conéctate a Oracle como administrador (SYS o SYSTEM):
   sqlplus sys/[password]@localhost:1521/XE as sysdba

2. Ejecuta este script:
   @oracle-setup.sql

3. Verifica que el usuario se haya creado correctamente:
   SELECT username, account_status FROM dba_users WHERE username = 'CUFRE_USER';

4. Prueba la conexión con el nuevo usuario:
   connect cufre_user/Cufre-2025@localhost:1521/XE

5. Si todo funciona correctamente, puedes iniciar la aplicación con:
   ./iniciar-con-oracle.sh
*/ 