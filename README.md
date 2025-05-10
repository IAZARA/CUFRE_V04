# Sistema de Gestión de Expedientes CUFRE

Este proyecto está organizado con una arquitectura de microservicios, separando el backend (Java/Spring Boot) y el frontend (React).

## Estructura del Proyecto

```
CUFRE_V04/
├── backend/                 # Código del backend (Java/Spring Boot)
│   ├── src/                 # Código fuente
│   ├── pom.xml              # Configuración de Maven
│   ├── Dockerfile           # Configuración para construir imagen Docker
│   └── ...
├── frontend/                # Código del frontend (React)
│   ├── src/                 # Código fuente
│   ├── public/              # Archivos estáticos
│   ├── package.json         # Dependencias de NPM
│   ├── Dockerfile           # Configuración para construir imagen Docker
│   └── ...
└── docker-compose.yml       # Configuración para ejecutar todos los servicios
```

## Requisitos

- Java 17
- Node.js (versión 16 o superior)
- Maven
- Docker (opcional, para contenedores)

## Ejecutar la Aplicación

### Modo Desarrollo

**Backend:**
```bash
cd backend
mvn spring-boot:run
```
El backend estará disponible en http://localhost:8080

**Frontend:**
```bash
cd frontend
npm install
npm start
```
El frontend estará disponible en http://localhost:3000

### Usando Docker (recomendado para producción)

Para ejecutar toda la aplicación usando Docker:

```bash
docker-compose up -d
```

El frontend estará disponible en http://localhost y el backend en http://localhost:8080

## Compilación

**Backend:**
```bash
cd backend
mvn clean install
```

**Frontend:**
```bash
cd frontend
npm run build
``` 