#!/bin/bash

# Colores para mejor legibilidad
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Iniciando CUFRE - Sistema de Gestión de Expedientes ===${NC}\n"

# Función para verificar si un puerto está en uso y matar el proceso
liberar_puerto() {
    PUERTO=$1
    DESCRIPCION=$2
    
    echo -e "${YELLOW}Verificando si el puerto $PUERTO ($DESCRIPCION) está ocupado...${NC}"
    
    # Verificar si el puerto está en uso
    if lsof -i :$PUERTO > /dev/null; then
        echo -e "${RED}Puerto $PUERTO está ocupado. Cerrando proceso...${NC}"
        PID=$(lsof -ti :$PUERTO)
        kill -9 $PID
        echo -e "${GREEN}Proceso en puerto $PUERTO finalizado.${NC}"
    else
        echo -e "${GREEN}Puerto $PUERTO libre.${NC}"
    fi
}

# Verificar y liberar puertos
liberar_puerto 8080 "Backend Spring Boot"
liberar_puerto 3000 "Frontend React - puerto principal"
liberar_puerto 4200 "Frontend React - puerto alternativo"

echo -e "\n${GREEN}=== Iniciando Backend (Spring Boot) ===${NC}"
# Cambiar al directorio backend e iniciar el servidor
cd backend
# Iniciar el servidor Spring Boot en segundo plano
nohup mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Servidor Backend iniciado con PID: $BACKEND_PID${NC}"
echo -e "${YELLOW}Logs disponibles en: $(pwd)/backend.log${NC}"

# Esperar a que el backend esté listo (aproximadamente)
echo -e "${YELLOW}Esperando a que el backend se inicie...${NC}"
sleep 15

echo -e "\n${GREEN}=== Iniciando Frontend ===${NC}"
# Cambiar al directorio frontend e iniciar el servidor
cd ../frontend
# Iniciar el servidor de desarrollo React en segundo plano
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}Servidor Frontend iniciado con PID: $FRONTEND_PID${NC}"
echo -e "${YELLOW}Logs disponibles en: $(pwd)/frontend.log${NC}"

# Volver al directorio raíz
cd ..

# Guardar los PIDs para poder finalizar los procesos más tarde
echo "$BACKEND_PID" > .backend_pid
echo "$FRONTEND_PID" > .frontend_pid

echo -e "\n${GREEN}=== CUFRE iniciado correctamente ===${NC}"
echo -e "${YELLOW}Backend:${NC} http://localhost:8080/api"
echo -e "${YELLOW}Frontend:${NC} http://localhost:3000 (o http://localhost:4200)"
echo -e "\n${YELLOW}Para detener los servicios, ejecuta: ./detener-cufre.sh${NC}"

# Crear un script para detener los servicios
cat > detener-cufre.sh << 'EOL'
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
EOL

# Hacer ejecutable el script de detención
chmod +x detener-cufre.sh 