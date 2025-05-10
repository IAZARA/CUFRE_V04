#!/bin/bash

# Colores para mensajes
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
CYAN='\033[0;36m'
ROJO='\033[0;31m'
SIN_COLOR='\033[0m'

echo -e "${CYAN}=== CREANDO SCHEMA/USUARIO CUFRE_USER EN ORACLE ===${SIN_COLOR}"

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

# Copiar el script SQL al contenedor
echo -e "${CYAN}Copiando script SQL al contenedor...${SIN_COLOR}"
docker cp scripts/crear-schema.sql $ORACLE_CONTAINER:/tmp/

# Ejecutar el script SQL como SYSDBA
echo -e "${CYAN}Ejecutando script SQL para crear el schema CUFRE_USER...${SIN_COLOR}"
docker exec -i $ORACLE_CONTAINER bash -c "cat > /tmp/wrapper.sql << EOF
SET ECHO OFF;
SET SERVEROUTPUT ON SIZE UNLIMITED;
SET LINESIZE 200;
SET PAGESIZE 100;
SET FEEDBACK OFF;
SET HEADING ON;

@/tmp/crear-schema.sql

EXIT;
EOF

sqlplus -S / as sysdba @/tmp/wrapper.sql
"

# Verificar el resultado
if [ $? -eq 0 ]; then
    echo -e "${VERDE}✅ Script SQL ejecutado correctamente.${SIN_COLOR}"
    echo -e "${VERDE}Ahora puedes iniciar la aplicación con ./iniciar-con-oracle.sh${SIN_COLOR}"
else
    echo -e "${ROJO}❌ Hubo un error al ejecutar el script SQL.${SIN_COLOR}"
fi

# Limpiar archivos temporales
docker exec -i $ORACLE_CONTAINER bash -c "rm /tmp/crear-schema.sql /tmp/wrapper.sql 2>/dev/null"

echo -e "${VERDE}Datos de acceso a la base de datos:${SIN_COLOR}"
echo -e "${CYAN}  - Usuario: CUFRE_USER${SIN_COLOR}"
echo -e "${CYAN}  - Contraseña: Cufre-2025${SIN_COLOR}"
echo -e "${CYAN}  - Conexión: localhost:1521/XE${SIN_COLOR}" 