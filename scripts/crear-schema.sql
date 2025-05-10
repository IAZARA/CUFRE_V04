-- Script para crear usuario/schema CUFRE_USER en Oracle
-- Para ser ejecutado como SYSDBA

-- Primero, desactivar la restricción de Common Users para crear usuarios sin prefijo C##
DECLARE
    v_param_value VARCHAR2(100);
BEGIN
    SELECT value INTO v_param_value FROM v$parameter WHERE name = '_common_user_prefix';
    DBMS_OUTPUT.PUT_LINE('Valor actual de _common_user_prefix: ' || v_param_value);
    
    EXECUTE IMMEDIATE 'ALTER SYSTEM SET "_common_user_prefix" = '''' SCOPE=SPFILE';
    DBMS_OUTPUT.PUT_LINE('Restricción de Common User desactivada.');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('No se pudo modificar el parámetro: ' || SQLERRM);
        DBMS_OUTPUT.PUT_LINE('Intentando crear el usuario cufre_user directamente...');
END;
/

-- Verificar si el usuario CUFRE_USER ya existe
DECLARE
    v_count NUMBER;
    v_username VARCHAR2(30) := 'CUFRE_USER';
BEGIN
    SELECT COUNT(*) INTO v_count FROM dba_users WHERE username = v_username;
    
    IF v_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('El usuario ' || v_username || ' ya existe.');
    ELSE
        -- Probar primero con la creación directa
        BEGIN
            EXECUTE IMMEDIATE 'CREATE USER ' || v_username || ' IDENTIFIED BY "Cufre-2025"';
            DBMS_OUTPUT.PUT_LINE('Usuario ' || v_username || ' creado exitosamente.');
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('Error al crear usuario ' || v_username || ' directamente: ' || SQLERRM);
                DBMS_OUTPUT.PUT_LINE('Intentando con prefijo C##...');
                
                -- Si falla, intentar con el prefijo C##
                DECLARE
                    v_c_username VARCHAR2(30) := 'C##' || v_username;
                    v_c_count NUMBER;
                BEGIN
                    -- Verificar si el usuario con prefijo C## ya existe
                    SELECT COUNT(*) INTO v_c_count FROM dba_users WHERE username = v_c_username;
                    
                    IF v_c_count > 0 THEN
                        DBMS_OUTPUT.PUT_LINE('El usuario ' || v_c_username || ' ya existe.');
                    ELSE
                        -- Crear usuario con prefijo C##
                        EXECUTE IMMEDIATE 'CREATE USER ' || v_c_username || ' IDENTIFIED BY "Cufre-2025"';
                        
                        -- Otorgar privilegios necesarios
                        EXECUTE IMMEDIATE 'GRANT CONNECT, RESOURCE TO ' || v_c_username;
                        EXECUTE IMMEDIATE 'GRANT CREATE SESSION TO ' || v_c_username;
                        EXECUTE IMMEDIATE 'GRANT CREATE TABLE TO ' || v_c_username;
                        EXECUTE IMMEDIATE 'GRANT CREATE VIEW TO ' || v_c_username;
                        EXECUTE IMMEDIATE 'GRANT CREATE SEQUENCE TO ' || v_c_username;
                        EXECUTE IMMEDIATE 'GRANT CREATE PROCEDURE TO ' || v_c_username;
                        EXECUTE IMMEDIATE 'GRANT CREATE TRIGGER TO ' || v_c_username;
                        EXECUTE IMMEDIATE 'GRANT UNLIMITED TABLESPACE TO ' || v_c_username;
                        
                        -- Crear sinónimo para que la aplicación pueda usar CUFRE_USER sin C##
                        EXECUTE IMMEDIATE 'CREATE PUBLIC SYNONYM CUFRE_USER FOR ' || v_c_username;
                        
                        DBMS_OUTPUT.PUT_LINE('Usuario ' || v_c_username || ' creado exitosamente con la contraseña Cufre-2025');
                        DBMS_OUTPUT.PUT_LINE('Actualiza tu application-oracle.properties para usar: ' || v_c_username);
                    END IF;
                EXCEPTION
                    WHEN OTHERS THEN
                        DBMS_OUTPUT.PUT_LINE('Error al crear usuario con prefijo C##: ' || SQLERRM);
                END;
        END;
    END IF;
END;
/

-- Otorgar privilegios si el usuario ya existe (sea CUFRE_USER o C##CUFRE_USER)
DECLARE
    v_users VARCHAR2(1000) := '';
    v_username VARCHAR2(30);
    v_cursor SYS_REFCURSOR;
BEGIN
    OPEN v_cursor FOR 
        SELECT username 
        FROM dba_users 
        WHERE username IN ('CUFRE_USER', 'C##CUFRE_USER');
    
    LOOP
        FETCH v_cursor INTO v_username;
        EXIT WHEN v_cursor%NOTFOUND;
        
        v_users := v_users || v_username || ' ';
        
        BEGIN
            EXECUTE IMMEDIATE 'GRANT CONNECT, RESOURCE TO ' || v_username;
            EXECUTE IMMEDIATE 'GRANT CREATE SESSION TO ' || v_username;
            EXECUTE IMMEDIATE 'GRANT CREATE TABLE TO ' || v_username;
            EXECUTE IMMEDIATE 'GRANT CREATE VIEW TO ' || v_username;
            EXECUTE IMMEDIATE 'GRANT CREATE SEQUENCE TO ' || v_username;
            EXECUTE IMMEDIATE 'GRANT CREATE PROCEDURE TO ' || v_username;
            EXECUTE IMMEDIATE 'GRANT CREATE TRIGGER TO ' || v_username;
            EXECUTE IMMEDIATE 'GRANT UNLIMITED TABLESPACE TO ' || v_username;
            
            DBMS_OUTPUT.PUT_LINE('Privilegios otorgados a ' || v_username);
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('Error al otorgar privilegios a ' || v_username || ': ' || SQLERRM);
        END;
    END LOOP;
    
    CLOSE v_cursor;
    
    IF v_users = '' THEN
        DBMS_OUTPUT.PUT_LINE('No se encontró ningún usuario CUFRE_USER o C##CUFRE_USER.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Usuarios encontrados: ' || v_users);
    END IF;
END;
/

-- Mostrar los usuarios creados
SELECT username, account_status, default_tablespace FROM dba_users 
WHERE username IN ('CUFRE_USER', 'C##CUFRE_USER'); 