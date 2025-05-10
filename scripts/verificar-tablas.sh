#!/bin/bash

# Colores para mensajes
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
CYAN='\033[0;36m'
ROJO='\033[0;31m'
SIN_COLOR='\033[0m'

echo -e "${CYAN}=== VERIFICANDO TABLAS EN LA BASE DE DATOS ORACLE ===${SIN_COLOR}"

# Verificar si docker está disponible
if ! command -v docker &> /dev/null; then
    echo -e "${ROJO}ERROR: Docker no está instalado.${SIN_COLOR}"
    echo -e "${AMARILLO}Por favor, instala Docker para continuar.${SIN_COLOR}"
    exit 1
fi

# Verificar si el contenedor Oracle está en ejecución
ORACLE_CONTAINER=$(docker ps | grep oracle-xe | awk '{print $1}')
if [ -z "$ORACLE_CONTAINER" ]; then
    echo -e "${ROJO}ERROR: No se encontró el contenedor Oracle en ejecución.${SIN_COLOR}"
    echo -e "${AMARILLO}Asegúrate de que el contenedor oracle-xe esté iniciado.${SIN_COLOR}"
    exit 1
fi

echo -e "${CYAN}Contenedor Oracle encontrado: $ORACLE_CONTAINER${SIN_COLOR}"

# Crear script SQL para verificar tablas
cat > /tmp/verificar-tablas.sql << EOF
-- Script para verificar tablas en la base de datos CUFRE
SET PAGESIZE 100
SET LINESIZE 200
SET FEEDBACK OFF
SET VERIFY OFF
SET HEADING ON
SET SERVEROUTPUT ON SIZE UNLIMITED

PROMPT === TABLAS EXISTENTES EN EL ESQUEMA C##CUFRE_USER ===

SELECT table_name FROM user_tables ORDER BY table_name;

PROMPT 

PROMPT === VERIFICANDO TABLA USUARIO ===

DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM user_tables WHERE table_name = 'USUARIO';
    
    IF v_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('✅ La tabla USUARIO existe.');
        
        -- Mostrar estructura de la tabla
        DBMS_OUTPUT.PUT_LINE('');
        DBMS_OUTPUT.PUT_LINE('Estructura de la tabla USUARIO:');
        FOR col_rec IN (SELECT column_name, data_type, data_length, nullable 
                        FROM user_tab_columns 
                        WHERE table_name = 'USUARIO' 
                        ORDER BY column_id) LOOP
            DBMS_OUTPUT.PUT_LINE('  - ' || RPAD(col_rec.column_name, 20) || 
                                RPAD(col_rec.data_type || 
                                    CASE WHEN col_rec.data_type = 'VARCHAR2' 
                                        THEN '(' || col_rec.data_length || ')' 
                                        ELSE '' END, 15) || 
                                CASE WHEN col_rec.nullable = 'Y' 
                                    THEN 'NULL' 
                                    ELSE 'NOT NULL' END);
        END LOOP;
        
        -- Mostrar número de registros
        DECLARE
            v_user_count NUMBER;
        BEGIN
            SELECT COUNT(*) INTO v_user_count FROM USUARIO;
            DBMS_OUTPUT.PUT_LINE('');
            DBMS_OUTPUT.PUT_LINE('Total de usuarios en la tabla: ' || v_user_count);
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('Error al contar usuarios: ' || SQLERRM);
        END;
    ELSE
        DBMS_OUTPUT.PUT_LINE('❌ La tabla USUARIO no existe.');
        DBMS_OUTPUT.PUT_LINE('');
        DBMS_OUTPUT.PUT_LINE('Para crear las tablas, ejecuta la aplicación con:');
        DBMS_OUTPUT.PUT_LINE('./iniciar-con-oracle.sh');
        DBMS_OUTPUT.PUT_LINE('');
        DBMS_OUTPUT.PUT_LINE('Spring Boot creará automáticamente las tablas al iniciar.');
    END IF;
END;
/

PROMPT

PROMPT === ESTADO DE FLYWAY MIGRATIONS (SI EXISTE) ===

DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM user_tables WHERE table_name = 'FLYWAY_SCHEMA_HISTORY';
    
    IF v_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('✅ La tabla FLYWAY_SCHEMA_HISTORY existe.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('❌ No se encontró tabla de Flyway.');
    END IF;
END;
/

-- Si existe la tabla Flyway, mostrar migraciones
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM user_tables WHERE table_name = 'FLYWAY_SCHEMA_HISTORY';
    
    IF v_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('');
        DBMS_OUTPUT.PUT_LINE('Migraciones aplicadas:');
        DBMS_OUTPUT.PUT_LINE('');
    END IF;
END;
/

SELECT version, description, 
       TO_CHAR(installed_on, 'YYYY-MM-DD HH24:MI:SS') as installed_on, 
       success
FROM flyway_schema_history
ORDER BY installed_rank;

PROMPT
PROMPT === FIN DEL REPORTE ===

EXIT;
EOF

# Copiar el script SQL al contenedor
echo -e "${CYAN}Copiando script SQL al contenedor...${SIN_COLOR}"
docker cp /tmp/verificar-tablas.sql $ORACLE_CONTAINER:/tmp/

# Ejecutar el script SQL
echo -e "${CYAN}Ejecutando script SQL para verificar tablas...${SIN_COLOR}"
docker exec -i $ORACLE_CONTAINER bash -c "sqlplus -S C##CUFRE_USER/Cufre-2025@localhost:1521/XE @/tmp/verificar-tablas.sql"

# Limpiar archivos temporales
rm /tmp/verificar-tablas.sql 2>/dev/null
docker exec -i $ORACLE_CONTAINER bash -c "rm /tmp/verificar-tablas.sql 2>/dev/null"

echo -e "${VERDE}✅ Verificación completa.${SIN_COLOR}"
echo -e "${CYAN}Si no ves la tabla USUARIO, ejecuta la aplicación con ./iniciar-con-oracle.sh${SIN_COLOR}"
echo -e "${CYAN}Spring Boot creará automáticamente las tablas necesarias al iniciar.${SIN_COLOR}" 