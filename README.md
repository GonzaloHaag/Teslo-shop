## Descripcion


## Correr en desarrollo(dev)
1. Clonar repositorio
2. Crear una copia del archivo .env.template y renombrarlo a .env y cambiar variables de entorno
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker-compose up -d ```
5. Correr migraciones de prisma ```npx prisma migrate dev ```
6. Ejecutar el seed ```npm run seed```
7. Limpiar el localStorage del navegador
8. Correr el proyecto ```npm run dev```


## Correr en produccion

