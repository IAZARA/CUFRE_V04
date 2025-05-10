-- Añade columna EMAIL a la tabla USUARIO
-- En Oracle no existe la sintaxis IF NOT EXISTS, así que usamos PL/SQL para verificar
DECLARE
  v_column_exists NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_column_exists
  FROM USER_TAB_COLUMNS
  WHERE TABLE_NAME = 'USUARIO' AND COLUMN_NAME = 'EMAIL';
  
  IF v_column_exists = 0 THEN
    EXECUTE IMMEDIATE 'ALTER TABLE USUARIO ADD EMAIL VARCHAR2(150)';
  END IF;
END;
/

-- Actualiza los valores existentes (usando el nombre de usuario como email temporal)
-- En Oracle, CONCAT solo acepta 2 argumentos, así que usamos ||
UPDATE USUARIO SET EMAIL = NOMBRE || '@cufre.com' WHERE EMAIL IS NULL;

-- Hace el campo NOT NULL después de actualizar los datos
-- En Oracle se usa MODIFY, no ALTER COLUMN
ALTER TABLE USUARIO MODIFY EMAIL VARCHAR2(150) NOT NULL;

-- Añade índice único 
-- Verificamos si existe antes de crearlo usando PL/SQL
DECLARE
  v_index_exists NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_index_exists
  FROM USER_INDEXES
  WHERE INDEX_NAME = 'IDX_USUARIO_EMAIL';
  
  IF v_index_exists = 0 THEN
    EXECUTE IMMEDIATE 'CREATE UNIQUE INDEX IDX_USUARIO_EMAIL ON USUARIO (EMAIL)';
  END IF;
END;
/ 