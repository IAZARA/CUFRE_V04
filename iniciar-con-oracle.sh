#!/bin/bash

# Colores para mensajes
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
CYAN='\033[0;36m'
ROJO='\033[0;31m'
SIN_COLOR='\033[0m'

echo -e "${VERDE}=== INICIANDO APLICACIÓN CUFRE CON ORACLE ===${SIN_COLOR}"

# Verificar si Oracle está instalado
echo -e "${CYAN}Verificando Oracle...${SIN_COLOR}"
if ! nc -z localhost 1521 >/dev/null 2>&1; then
    echo -e "${ROJO}ERROR: No se pudo conectar a Oracle en localhost:1521${SIN_COLOR}"
    echo -e "${AMARILLO}Asegúrate de que Oracle esté instalado y el servicio esté ejecutándose.${SIN_COLOR}"
    echo -e "${AMARILLO}También verifica que el firewall permita conexiones al puerto 1521.${SIN_COLOR}"
    
    read -p "¿Deseas intentar iniciar la aplicación de todos modos? (s/n): " respuesta
    if [[ "$respuesta" != "s" && "$respuesta" != "S" ]]; then
        echo -e "${ROJO}Operación cancelada.${SIN_COLOR}"
        exit 1
    fi
fi

# Iniciar directamente Spring Boot con perfil Oracle (sin tmux)
echo -e "${CYAN}Iniciando backend con Oracle...${SIN_COLOR}"
cd backend

# Verificar qué método de arranque está disponible
if [ -f "mvnw" ]; then
    echo -e "${CYAN}Usando Maven Wrapper (mvnw)${SIN_COLOR}"
    chmod +x mvnw
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=oracle
elif command -v mvn &> /dev/null; then
    echo -e "${CYAN}Usando Maven global (mvn)${SIN_COLOR}"
    mvn spring-boot:run -Dspring-boot.run.profiles=oracle
elif [ -f "target/*.jar" ]; then
    echo -e "${CYAN}Usando JAR compilado${SIN_COLOR}"
    java -jar target/*.jar --spring.profiles.active=oracle
else
    echo -e "${ROJO}ERROR: No se encontró forma de iniciar el backend. Asegúrate de tener Maven instalado o compilar el proyecto.${SIN_COLOR}"
    echo -e "${AMARILLO}Puedes instalar Maven con: brew install maven${SIN_COLOR}"
    exit 1
fi

echo -e "${VERDE}Los servicios han sido iniciados correctamente.${SIN_COLOR}"
echo -e "${VERDE}=== INFORMACIÓN PARA ACCEDER A LA APLICACIÓN CON ORACLE ===${SIN_COLOR}"
echo -e "${CYAN}Backend API: http://localhost:8080/api${SIN_COLOR}"
echo -e "${CYAN}Endpoint de salud: http://localhost:8080/api/actuator/health${SIN_COLOR}"
echo -e "${VERDE}=== DETALLES DE CONEXIÓN ORACLE ===${SIN_COLOR}"
echo -e "${CYAN}- URL: jdbc:oracle:thin:@localhost:1521:XE${SIN_COLOR}"
echo -e "${CYAN}- Usuario: C##CUFRE_USER${SIN_COLOR}"
echo -e "${CYAN}- Contraseña: Cufre-2025${SIN_COLOR}" 