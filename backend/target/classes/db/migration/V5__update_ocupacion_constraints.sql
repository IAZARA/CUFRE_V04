-- Actualizar los posibles valores para la ocupación del prófugo
-- Primero, verificar si ya existe alguna restricción y eliminarla
DECLARE
  v_constraint_name VARCHAR2(30);
BEGIN
  SELECT constraint_name INTO v_constraint_name
  FROM user_constraints
  WHERE table_name = 'EXPEDIENTE' 
  AND constraint_type = 'C'
  AND search_condition LIKE '%PROFUGO_PROFESION_OCUPACION%';
  
  EXECUTE IMMEDIATE 'ALTER TABLE EXPEDIENTE DROP CONSTRAINT ' || v_constraint_name;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    NULL; -- No hacer nada si no existe la restricción
END;
/

-- Agregar la nueva restricción
ALTER TABLE EXPEDIENTE ADD CONSTRAINT CHK_PROFUGO_OCUPACION CHECK (
  PROFUGO_PROFESION_OCUPACION IN (
    'OTRO',
    'OFICIO',
    'EMPLEADO',
    'PROFESIONAL',
    'FUERZA SEGURIDAD',
    'FUERZA ARMADA',
    'SERVICIO DE INTELIGENCIA',
    'DESOCUPADO',
    'COMERCIANTE'
  )
);

-- Actualizar valores existentes a OTRO si no coinciden con los nuevos valores permitidos
UPDATE EXPEDIENTE 
SET PROFUGO_PROFESION_OCUPACION = 'OTRO' 
WHERE PROFUGO_PROFESION_OCUPACION IS NULL OR 
      PROFUGO_PROFESION_OCUPACION NOT IN (
        'OTRO',
        'OFICIO',
        'EMPLEADO',
        'PROFESIONAL',
        'FUERZA SEGURIDAD',
        'FUERZA ARMADA',
        'SERVICIO DE INTELIGENCIA',
        'DESOCUPADO',
        'COMERCIANTE'
      );

-- Commit para aplicar los cambios
COMMIT; 