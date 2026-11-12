// Importamos el paquete 'pg' usando el sistema de módulos ES.
import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargamos las variables definidas en el archivo .env desde la raíz del backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const requiredDatabaseEnv = ["DB_USER", "DB_PASSWORD", "DB_NAME"];
const missingDatabaseEnv = requiredDatabaseEnv.filter(
    (key) => !process.env[key],
);

if (missingDatabaseEnv.length > 0) {
    throw new Error(
        `Faltan variables de conexión a PostgreSQL: ${missingDatabaseEnv.join(", ")}`,
    );
}

// Creamos y exportamos una instancia única del pool de PostgreSQL
export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
});

pool.on("connect", () => {
    console.log('Conectado a PostgreSQL');
});

pool.on("error", (err) => {
    console.error('Error en la conexión a PostgreSQL', err);
});
