DECLARE
    v_count NUMBER := 0;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM user_tab_columns
    WHERE table_name = 'EXPEDIENTE'
      AND column_name = 'FOTO_PRINCIPAL_ID';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE EXPEDIENTE ADD (FOTO_PRINCIPAL_ID NUMBER(19))';
    END IF;
END;
/ 