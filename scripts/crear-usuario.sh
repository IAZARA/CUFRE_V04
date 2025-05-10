#!/bin/bash

# Colores para mensajes
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
CYAN='\033[0;36m'
ROJO='\033[0;31m'
SIN_COLOR='\033[0m'

echo -e "${CYAN}=== CREANDO USUARIO EN LA APLICACIÓN CUFRE ===${SIN_COLOR}"

# Verificar si la aplicación está ejecutándose
echo -e "${CYAN}Verificando si la aplicación está en ejecución...${SIN_COLOR}"
if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/actuator/health | grep -q "200"; then
    echo -e "${ROJO}ERROR: La aplicación no está en ejecución o no es accesible.${SIN_COLOR}"
    echo -e "${AMARILLO}Por favor, inicia la aplicación con ./iniciar-con-oracle.sh y vuelve a intentarlo.${SIN_COLOR}"
    exit 1
fi

# Verificar si curl está instalado
if ! command -v curl &> /dev/null; then
    echo -e "${ROJO}ERROR: curl no está instalado. Es necesario para crear el usuario.${SIN_COLOR}"
    echo -e "${AMARILLO}Puedes instalar curl con: brew install curl${SIN_COLOR}"
    exit 1
fi

# Parámetros por defecto (pueden ser modificados por argumentos)
EMAIL="ivan.zarate@minseg.gob.ar"
PASSWORD="Minseg2025-"
NOMBRE="Ivan"
APELLIDO="Zarate"
ROL="USUARIOCARGA"  # Opciones: SUPERUSUARIO, ADMINISTRADOR, USUARIOCARGA, USUARIOCONSULTA

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

# Payload JSON para la solicitud
read -r -d '' PAYLOAD << EOM
{
  "nombre": "$NOMBRE",
  "apellido": "$APELLIDO",
  "email": "$EMAIL",
  "password": "$PASSWORD",
  "rol": "$ROL"
}
EOM

echo -e "${CYAN}Enviando solicitud a la API...${SIN_COLOR}"

# Realizar la solicitud HTTP para crear el usuario
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  http://localhost:8080/api/auth/register)

# Verificar si la solicitud fue exitosa
if echo "$RESPONSE" | grep -q "token"; then
    echo -e "${VERDE}✅ Usuario creado exitosamente!${SIN_COLOR}"
    echo -e "${VERDE}Datos de la respuesta:${SIN_COLOR}"
    echo "$RESPONSE" | python3 -m json.tool || echo "$RESPONSE"
else
    echo -e "${ROJO}❌ Error al crear el usuario.${SIN_COLOR}"
    echo -e "${AMARILLO}Respuesta de la API:${SIN_COLOR}"
    echo "$RESPONSE" | python3 -m json.tool || echo "$RESPONSE"
    
    # Verificar si el error es de usuario duplicado
    if echo "$RESPONSE" | grep -q "already exists"; then
        echo -e "${AMARILLO}Parece que ya existe un usuario con este email.${SIN_COLOR}"
    fi
fi 