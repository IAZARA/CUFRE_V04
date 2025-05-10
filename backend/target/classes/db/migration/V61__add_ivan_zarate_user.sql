-- Añadir usuario Ivan Zarate con rol SUPERUSUARIO solo si no existe
BEGIN
  DECLARE
    v_count NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_count FROM USUARIO WHERE EMAIL = 'ivan.zarate@minseg.gob.ar';
    
    -- Solo insertar si no existe
    IF v_count = 0 THEN
      INSERT INTO USUARIO (ID, ROL, NOMBRE, APELLIDO, CONTRASENA, DEPENDENCIA, EMAIL)
      VALUES (
          SEQ_USUARIO.NEXTVAL, 
          'SUPERUSUARIO', 
          'Ivan', 
          'Zarate', 
          '$2a$10$zIZXvwvgL3jHcOyqE0xiWOT0mMf6BpTejP9Y7ZOfRqgiTI9QFraoi', -- Hash para 'Minseg2025-'
          'MINISTERIO DE SEGURIDAD', 
          'ivan.zarate@minseg.gob.ar'
      );
      DBMS_OUTPUT.PUT_LINE('Usuario Ivan Zarate creado correctamente');
    ELSE
      DBMS_OUTPUT.PUT_LINE('El usuario Ivan Zarate ya existe');
    END IF;
  END;
END;
/

COMMIT; 