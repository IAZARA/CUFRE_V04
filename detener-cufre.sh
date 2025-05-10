#!/bin/bash

# Colores para mejor legibilidad
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}=== Deteniendo CUFRE ===${NC}"

# Detener el backend
if [ -f .backend_pid ]; then
    BACKEND_PID=$(cat .backend_pid)
    if ps -p $BACKEND_PID > /dev/null; then
        echo -e "${RED}Deteniendo Backend (PID: $BACKEND_PID)...${NC}"
        kill -9 $BACKEND_PID
        rm .backend_pid
    else
        echo -e "${RED}Proceso Backend (PID: $BACKEND_PID) ya no está en ejecución.${NC}"
        rm .backend_pid
    fi
else
    echo -e "${RED}No se encontró el PID del Backend.${NC}"
fi

# Detener el frontend
if [ -f .frontend_pid ]; then
    FRONTEND_PID=$(cat .frontend_pid)
    if ps -p $FRONTEND_PID > /dev/null; then
        echo -e "${RED}Deteniendo Frontend (PID: $FRONTEND_PID)...${NC}"
        kill -9 $FRONTEND_PID
        rm .frontend_pid
    else
        echo -e "${RED}Proceso Frontend (PID: $FRONTEND_PID) ya no está en ejecución.${NC}"
        rm .frontend_pid
    fi
else
    echo -e "${RED}No se encontró el PID del Frontend.${NC}"
fi

# Por si acaso, verificar si alguno de los puertos sigue ocupado
for PORT in 8080 3000 4200; do
    if lsof -ti :$PORT > /dev/null; then
        echo -e "${RED}Puerto $PORT sigue ocupado. Cerrando proceso...${NC}"
        kill -9 $(lsof -ti :$PORT)
    fi
done

echo -e "${GREEN}=== CUFRE detenido correctamente ===${NC}"
