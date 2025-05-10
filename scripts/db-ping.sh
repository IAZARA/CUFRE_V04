#!/bin/bash

# Colores para mensajes
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
CYAN='\033[0;36m'
ROJO='\033[0;31m'
SIN_COLOR='\033[0m'

echo -e "${CYAN}=== VERIFICANDO CONEXIÓN A BASE DE DATOS ORACLE ===${SIN_COLOR}"
echo -e "${AMARILLO}Este script intentará conectarse a la base de datos Oracle configurada en application.properties${SIN_COLOR}"
echo -e "${AMARILLO}Presiona Ctrl+C para cancelar${SIN_COLOR}"

HEALTH_URL="http://localhost:8080/api/actuator/health"
MAX_ATTEMPTS=30
WAIT_SECONDS=2

# Verificar si curl está instalado
if ! command -v curl &> /dev/null; then
    echo -e "${ROJO}ERROR: curl no está instalado. Es necesario para realizar la verificación.${SIN_COLOR}"
    echo -e "${AMARILLO}Puedes instalar curl con: brew install curl${SIN_COLOR}"
    exit 1
fi

# Intentar iniciar la aplicación con el perfil por defecto (Oracle)
echo -e "${CYAN}Iniciando aplicación con el perfil por defecto (Oracle)...${SIN_COLOR}"
cd ../backend
# Comprobamos qué método de arranque está disponible
if [ -f "mvnw" ]; then
    echo -e "${CYAN}Usando Maven Wrapper (mvnw)${SIN_COLOR}"
    chmod +x mvnw
    ./mvnw spring-boot:run > /dev/null 2>&1 &
elif command -v mvn &> /dev/null; then
    echo -e "${CYAN}Usando Maven global (mvn)${SIN_COLOR}"
    mvn spring-boot:run > /dev/null 2>&1 &
elif [ -f "target/*.jar" ]; then
    echo -e "${CYAN}Usando JAR compilado${SIN_COLOR}"
    java -jar target/*.jar > /dev/null 2>&1 &
else
    echo -e "${ROJO}ERROR: No se encontró forma de iniciar el backend.${SIN_COLOR}"
    exit 1
fi

APP_PID=$!
echo -e "${VERDE}Aplicación iniciada en segundo plano con PID: $APP_PID${SIN_COLOR}"

# Función para limpiar al salir
cleanup() {
    echo -e "\n${CYAN}Cerrando aplicación...${SIN_COLOR}"
    kill $APP_PID
    exit 0
}

# Atrapar señal de interrupción
trap cleanup SIGINT

echo -e "${CYAN}Esperando que la aplicación esté lista...${SIN_COLOR}"
sleep 10

# Intentar verificar la conexión a la base de datos
attempt=1
while [ $attempt -le $MAX_ATTEMPTS ]; do
    echo -e "${CYAN}Intento $attempt de $MAX_ATTEMPTS${SIN_COLOR}"
    
    # Realizar la solicitud al endpoint de salud
    response=$(curl -s $HEALTH_URL)
    db_status=$(echo $response | grep -o '"db":{[^}]*}' | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    
    if [ "$db_status" = "UP" ]; then
        echo -e "${VERDE}✅ Conexión exitosa a la base de datos Oracle!${SIN_COLOR}"
        echo -e "${VERDE}Respuesta completa:${SIN_COLOR}"
        echo $response | python -m json.tool
        cleanup
    else
        echo -e "${ROJO}❌ La base de datos no está disponible.${SIN_COLOR}"
        echo -e "${AMARILLO}Detalles: $(echo $response | grep -o '"db":{[^}]*}')${SIN_COLOR}"
        echo -e "${AMARILLO}Esperando $WAIT_SECONDS segundos antes del siguiente intento...${SIN_COLOR}"
        sleep $WAIT_SECONDS
    fi
    
    attempt=$((attempt+1))
done

echo -e "${ROJO}❌ No se pudo establecer conexión con la base de datos después de $MAX_ATTEMPTS intentos.${SIN_COLOR}"
echo -e "${AMARILLO}Verifica que Oracle esté instalado y corriendo con la configuración correcta.${SIN_COLOR}"
echo -e "${AMARILLO}Parámetros de conexión (en application.properties):${SIN_COLOR}"
echo -e "${CYAN}  - URL: $(grep 'spring.datasource.url' ../backend/src/main/resources/application.properties | cut -d'=' -f2-)${SIN_COLOR}"
echo -e "${CYAN}  - Usuario: $(grep 'spring.datasource.username' ../backend/src/main/resources/application.properties | cut -d'=' -f2-)${SIN_COLOR}"

# Limpiar al finalizar
cleanup 