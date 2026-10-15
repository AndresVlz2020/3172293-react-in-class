// Importamos el paquete 'pg' usando el sistema de módulos ES.// Importamos el paqueteSQL para Node.js

import pkg from 'pg';

// Extraemos la clase Pool desde el paquete
// Pool gestiona un conjunto de conexiones reutilizables a la BD.

const { Pool } = pkg;

// Importamos dotenv para poder leer variables de entorno desde un archivo .env

import dotenv from 'dotenv';

// Cargamos las variables definidas en el archivo .env  

dotenv.config();

// Creanos y exportamos una instancia únoca del pool de PostgreSQL
// Esta instancia se reutilizará en toda la aplicación

export const pool = new Pool({

    // Host donde se encuentra PostgreSQL (ej: localhost o IP del servidor)

    host: process.env.DB_HOST,

    // Puerto donde se encuentra PostgreSQL

    port: process.env.DB_PORT,

    // Usuario con permisos sobre la base de datos

    user: process.env.DB_USER,

    // Contrasena del usuario

    password: process.env.DB_PASSWORD,

    // Nombre de la base de datos a la que nos conectamos

    database: process.env.DB_NAME,

    // Número de conexiones activas en el pool

    max: 10,

    // Tiempo máximo (en ms) que una conexión puede estar inactiva antes de ser cerrada automáticamente 
    idleTimeoutMillis: 30000,

    });

    // Evento que se dispara cada vez que el pool establece una conexión útil para logs y verificación en desarrollo

    pool.on("connect", () => {
        console.log('Conectado a PostgreSQL');
    });

    // Evento que se dispara cada vez que ocurre un error en el pool, Importante para monitoreo y diagnnóstico de fallos

    pool.on("error", (err)  => {
        console.error('Error en la conexión a PostgreSQL', err);
    });
    