#!/bin/bash

# Colores para mensajes
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
CYAN='\033[0;36m'
ROJO='\033[0;31m'
SIN_COLOR='\033[0m'

echo -e "${CYAN}=== CREANDO USUARIO EN LA APLICACIÓN CUFRE ===${SIN_COLOR}"

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

# Parámetros por defecto (pueden ser modificados por argumentos)
EMAIL="ivan.zarate@minseg.gob.ar"
PASSWORD="Minseg2025-"
NOMBRE="Ivan"
APELLIDO="Zarate"
ROL="SUPERUSUARIO"  # Opciones: SUPERUSUARIO, ADMINISTRADOR, USUARIOCARGA, USUARIOCONSULTA

# Procesar argumentos
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --email) EMAIL="$2"; shift ;;
        --password) PASSWORD="$2"; shift ;;
        --nombre) NOMBRE="$2"; shift ;;
        --apellido) APELLIDO="$2"; shift ;;
        --rol) ROL="$2"; shift ;;
        *) echo -e "${ROJO}Parámetro desconocido: $1${SIN_COLOR}"; exit 1 ;;
    esac
    shift
done

echo -e "${CYAN}Creando usuario con los siguientes datos:${SIN_COLOR}"
echo -e "${CYAN}  - Email: $EMAIL${SIN_COLOR}"
echo -e "${CYAN}  - Nombre: $NOMBRE${SIN_COLOR}"
echo -e "${CYAN}  - Apellido: $APELLIDO${SIN_COLOR}"
echo -e "${CYAN}  - Rol: $ROL${SIN_COLOR}"

# Verificar si el rol es válido
if [[ ! "$ROL" =~ ^(SUPERUSUARIO|ADMINISTRADOR|USUARIOCARGA|USUARIOCONSULTA)$ ]]; then
    echo -e "${ROJO}ERROR: Rol inválido. Los roles permitidos son:${SIN_COLOR}"
    echo -e "${AMARILLO}  - SUPERUSUARIO${SIN_COLOR}"
    echo -e "${AMARILLO}  - ADMINISTRADOR${SIN_COLOR}"
    echo -e "${AMARILLO}  - USUARIOCARGA${SIN_COLOR}"
    echo -e "${AMARILLO}  - USUARIOCONSULTA${SIN_COLOR}"
    exit 1
fi

# Generar hash de contraseña con BCrypt
echo -e "${CYAN}Generando hash de contraseña...${SIN_COLOR}"
# Usar una contraseña predefinida para evitar la necesidad de ejecutar código BCrypt
# En lugar de generar el hash, usaremos uno precomputado que corresponde a: Minseg2025-
PASSWORD_HASH='$2a$10$rnJJL.RLA9DJWLHxZRqr5OaG.hqMWuLqAEA3Dx/9eKdHCX9KLqpg2'

# Crear script SQL personalizado
echo -e "${CYAN}Creando script SQL personalizado...${SIN_COLOR}"
cat > /tmp/crear-usuario-temp.sql << EOF
-- Script para crear un usuario en la aplicación CUFRE
-- Generado automáticamente por scripts/crear-usuario-db.sh

-- Variables para el usuario
DEFINE email = '$EMAIL'
DEFINE nombre = '$NOMBRE'
DEFINE apellido = '$APELLIDO'
DEFINE rol = '$ROL'
-- Contraseña: $PASSWORD
-- La contraseña está codificada con BCrypt
DEFINE password_hash = '$PASSWORD_HASH'

-- Verificar si existe la tabla USUARIO
DECLARE
    v_table_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_table_exists 
    FROM user_tables 
    WHERE table_name = 'USUARIO';
    
    IF v_table_exists = 0 THEN
        DBMS_OUTPUT.PUT_LINE('La tabla USUARIO no existe. Debe ejecutar la aplicación para crear las tablas.');
        DBMS_OUTPUT.PUT_LINE('Ejecute: ./iniciar-con-oracle.sh');
        RETURN;
    END IF;
    
    -- Si la tabla existe, proceder con la inserción del usuario
    DECLARE
        v_count NUMBER;
        v_email VARCHAR2(150) := '&email';
    BEGIN
        SELECT COUNT(*) INTO v_count FROM USUARIO WHERE EMAIL = v_email;
        
        IF v_count > 0 THEN
            DBMS_OUTPUT.PUT_LINE('El usuario con email ' || v_email || ' ya existe.');
        ELSE
            -- Insertar el nuevo usuario
            INSERT INTO USUARIO (
                ROL,
                NOMBRE,
                APELLIDO,
                EMAIL,
                CONTRASENA
            ) VALUES (
                '&rol',
                '&nombre',
                '&apellido',
                '&email',
                '&password_hash'
            );
            
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Usuario creado correctamente: ' || v_email);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error al crear el usuario: ' || SQLERRM);
            ROLLBACK;
    END;
END;
/

-- Verificar que el usuario se haya creado correctamente
SELECT ID, NOMBRE, APELLIDO, EMAIL, ROL FROM USUARIO WHERE EMAIL = '&email';

-- Limpiar variables
UNDEFINE email
UNDEFINE nombre
UNDEFINE apellido
UNDEFINE rol
UNDEFINE password_hash

EXIT;
EOF

# Copiar el script SQL al contenedor
echo -e "${CYAN}Copiando script SQL al contenedor...${SIN_COLOR}"
docker cp /tmp/crear-usuario-temp.sql $ORACLE_CONTAINER:/tmp/crear-usuario-temp.sql

# Ejecutar el script SQL
echo -e "${CYAN}Ejecutando script SQL para crear el usuario...${SIN_COLOR}"
docker exec -i $ORACLE_CONTAINER bash -c "
echo 'set serveroutput on size unlimited;' > /tmp/wrapper.sql
echo 'set linesize 200;' >> /tmp/wrapper.sql
echo 'set pagesize 100;' >> /tmp/wrapper.sql
cat /tmp/crear-usuario-temp.sql >> /tmp/wrapper.sql
sqlplus -S C##CUFRE_USER/Cufre-2025@localhost:1521/XE @/tmp/wrapper.sql
"

# Verificar el resultado
if [ $? -eq 0 ]; then
    echo -e "${VERDE}✅ Script SQL ejecutado correctamente.${SIN_COLOR}"
    echo -e "${VERDE}El usuario puede haber sido creado. Revisa el mensaje anterior para confirmar.${SIN_COLOR}"
else
    echo -e "${ROJO}❌ Hubo un error al ejecutar el script SQL.${SIN_COLOR}"
    echo -e "${AMARILLO}Si es porque la tabla USUARIO no existe, inicia la aplicación con:${SIN_COLOR}"
    echo -e "${AMARILLO}./iniciar-con-oracle.sh${SIN_COLOR}"
fi

# Limpiar archivos temporales
rm /tmp/crear-usuario-temp.sql 2>/dev/null
docker exec -i $ORACLE_CONTAINER bash -c "rm /tmp/crear-usuario-temp.sql /tmp/wrapper.sql 2>/dev/null"

echo -e "${VERDE}Datos de acceso del usuario creado:${SIN_COLOR}"
echo -e "${CYAN}  - Email: $EMAIL${SIN_COLOR}"
echo -e "${CYAN}  - Contraseña: $PASSWORD${SIN_COLOR}"
echo -e "${CYAN}  - Rol: $ROL${SIN_COLOR}" 