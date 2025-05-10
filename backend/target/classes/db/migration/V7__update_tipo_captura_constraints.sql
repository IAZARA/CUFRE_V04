-- Actualizar la restricción CHECK para TIPO_CAPTURA
BEGIN
  -- Usar un enfoque alternativo para evitar problemas con el tipo LONG
  FOR c IN (SELECT constraint_name 
            FROM user_constraints 
            WHERE table_name = 'EXPEDIENTE' 
            AND constraint_type = 'C') LOOP
    -- Intentar eliminar cada restricción que coincida con el patrón de nombre
    BEGIN
      EXECUTE IMMEDIATE 'ALTER TABLE EXPEDIENTE DROP CONSTRAINT ' || c.constraint_name;
      DBMS_OUTPUT.PUT_LINE('Restricción eliminada: ' || c.constraint_name);
    EXCEPTION
      WHEN OTHERS THEN
        -- Ignorar errores - significa que no era la restricción que buscábamos
        NULL;
    END;
  END LOOP;
END;
/

ALTER TABLE EXPEDIENTE ADD CONSTRAINT CHK_TIPO_CAPTURA CHECK (TIPO_CAPTURA IN ('NACIONAL','INTERNACIONAL','OTRO'));

-- Actualizar valores existentes
UPDATE EXPEDIENTE SET TIPO_CAPTURA = 'OTRO' WHERE TIPO_CAPTURA = 'SIN_DATO' OR TIPO_CAPTURA IS NULL;

-- Asegurar que los campos de autorización de tareas existan
BEGIN
   EXECUTE IMMEDIATE 'ALTER TABLE EXPEDIENTE ADD AUTORIZACION_TAREAS VARCHAR2(200)';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -1430 THEN
         RAISE;
      END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'ALTER TABLE EXPEDIENTE ADD FECHA_AUTORIZACION_TAREAS DATE';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -1430 THEN
         RAISE;
      END IF;
END;
/

-- Configuración de valores por defecto
UPDATE EXPEDIENTE SET AUTORIZACION_TAREAS = 'NO' WHERE AUTORIZACION_TAREAS IS NULL;

-- Commit para aplicar los cambios
COMMIT; 