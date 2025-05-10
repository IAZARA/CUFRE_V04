-- Actualizar los posibles valores para la fuerza asignada
-- Primero, verificar si ya existe alguna restricción y eliminarla
DECLARE
  v_constraint_name VARCHAR2(30);
BEGIN
  SELECT constraint_name INTO v_constraint_name
  FROM user_constraints
  WHERE table_name = 'EXPEDIENTE' 
  AND constraint_type = 'C'
  AND search_condition LIKE '%FUERZA_ASIGNADA%';
  
  EXECUTE IMMEDIATE 'ALTER TABLE EXPEDIENTE DROP CONSTRAINT ' || v_constraint_name;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    NULL; -- No hacer nada si no existe la restricción
END;
/

-- Agregar la nueva restricción
ALTER TABLE EXPEDIENTE ADD CONSTRAINT CHK_FUERZA_ASIGNADA CHECK (
  FUERZA_ASIGNADA IN (
    'S/D',
    'GNA',
    'PFA',
    'PSA',
    'PNA',
    'SPF',
    'POL LOCAL',
    'INTERPOL',
    'AMERIPOL',
    'EUROPOL',
    'BLOQUE DE BÚSQUEDA CUFRE'
  )
);

-- Actualizar valores existentes a S/D si están vacíos o son nulos
UPDATE EXPEDIENTE 
SET FUERZA_ASIGNADA = 'S/D' 
WHERE FUERZA_ASIGNADA IS NULL OR FUERZA_ASIGNADA = '';

-- Commit para aplicar los cambios
COMMIT; 