# Configuración de Base de Datos Oracle para CUFRE

Este documento proporciona instrucciones para configurar la base de datos Oracle y conectarla con la aplicación CUFRE.

## Requisitos Previos

- Oracle Database instalado (XE, Standard o Enterprise)
- SQLPlus o SQL Developer para ejecutar scripts
- Usuario con privilegios administrativos (SYS o SYSTEM)

## Instalación de Oracle XE (si aún no está instalado)

### En MacOS

1. Descargar Docker Desktop desde [Docker Hub](https://hub.docker.com/editions/community/docker-ce-desktop-mac/)

2. Instalar Oracle XE usando Docker:
   ```bash
   docker pull gvenzl/oracle-xe
   docker run -d --name oracle-xe -p 1521:1521 -e ORACLE_PASSWORD=SysPassword1 gvenzl/oracle-xe
   ```

3. Verificar que el contenedor esté funcionando:
   ```bash
   docker ps
   ```

### En Windows/Linux

1. Descargar Oracle Database XE desde [Oracle Website](https://www.oracle.com/database/technologies/xe-downloads.html)
2. Seguir las instrucciones de instalación del asistente
3. Recordar la contraseña establecida para el usuario SYS

## Configuración de la Base de Datos

### Opción 1: Usando el script automático

1. Conéctate a Oracle como administrador:
   ```bash
   sqlplus sys/SysPassword1@localhost:1521/XE as sysdba
   ```
   (Reemplaza `SysPassword1` con tu contraseña de administrador)

2. Ejecuta el script de configuración:
   ```sql
   @scripts/oracle-setup.sql
   ```

3. Verifica que el usuario se haya creado correctamente:
   ```sql
   SELECT username, account_status FROM dba_users WHERE username = 'CUFRE_USER';
   ```

### Opción 2: Configuración manual

1. Conéctate a Oracle como administrador:
   ```bash
   sqlplus sys/SysPassword1@localhost:1521/XE as sysdba
   ```

2. Crea el usuario y otorga los permisos:
   ```sql
   CREATE USER CUFRE_USER IDENTIFIED BY "Cufre-2025";
   GRANT CONNECT, RESOURCE TO CUFRE_USER;
   GRANT CREATE SESSION TO CUFRE_USER;
   GRANT CREATE TABLE TO CUFRE_USER;
   GRANT CREATE VIEW TO CUFRE_USER;
   GRANT CREATE SEQUENCE TO CUFRE_USER;
   GRANT CREATE PROCEDURE TO CUFRE_USER;
   GRANT CREATE TRIGGER TO CUFRE_USER;
   GRANT UNLIMITED TABLESPACE TO CUFRE_USER;
   ```

## Verificación de la Conexión

### Usando SQLPlus

1. Intenta conectarte con el usuario creado:
   ```bash
   sqlplus cufre_user/Cufre-2025@localhost:1521/XE
   ```

2. Si la conexión es exitosa, verás un mensaje como:
   ```
   Connected to:
   Oracle Database 21c Express Edition Release 21.0.0.0.0 - Production
   ```

### Usando el script de verificación

Ejecuta el script de verificación de conexión:
```bash
./scripts/db-ping.sh
```

El script intentará conectarse a la base de datos y verificará si está funcionando correctamente.

## Iniciar la Aplicación con Oracle

Una vez configurada la base de datos, puedes iniciar la aplicación utilizando Oracle en lugar de H2:

```bash
./iniciar-con-oracle.sh
```

Este script iniciará:
- El backend con el perfil "oracle" (usando la configuración en `application-oracle.properties`)
- El frontend de React

## Solución de Problemas

### Error de conexión

Si obtienes errores de conexión como "ORA-12505" o "Connection refused":

1. Verifica que Oracle esté ejecutándose:
   ```bash
   # Si usas Docker:
   docker ps | grep oracle
   
   # Si es una instalación nativa:
   ps -ef | grep oracle
   ```

2. Verifica que el puerto 1521 esté abierto:
   ```bash
   nc -zv localhost 1521
   ```

3. Verifica la configuración del listener:
   ```bash
   lsnrctl status
   ```

### Error de autenticación

Si obtienes errores como "ORA-01017: invalid username/password":

1. Verifica las credenciales en `application-oracle.properties`
2. Intenta restablecer la contraseña del usuario:
   ```sql
   ALTER USER CUFRE_USER IDENTIFIED BY "Cufre-2025";
   ```

### Errores de migración

Si Flyway muestra errores durante la migración:

1. Puedes deshabilitar Flyway temporalmente en `application-oracle.properties`:
   ```
   spring.flyway.enabled=false
   ```

2. Luego, ejecutar la aplicación una vez para que Hibernate cree las tablas (cambia `validate` a `update`):
   ```
   spring.jpa.hibernate.ddl-auto=update
   ```

3. Después de verificar que las tablas existen, vuelve a la configuración original.

## Parámetros de Conexión

Los parámetros de conexión a la base de datos están en `backend/src/main/resources/application-oracle.properties`:

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE
spring.datasource.username=cufre_user
spring.datasource.password=Cufre-2025
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
```

Si necesitas cambiar alguno de estos parámetros, edita ese archivo y reinicia la aplicación. 