// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.

import { pool } from "../../config/db.js";

// Exportamos el repositorio de usuarios
// El repository encapsula todas las consultas SQL relacionadas con users.

export const userRepository = {
    async getAll() {
        const query = `
            SELECT
                id,
                user_name AS name,
                user_email AS email,
                user_phone AS phone,
                user_document_types AS document_type,
                user_document_number AS document_number,
                is_active AS "isActive"
            FROM users
            ORDER BY id ASC;
        `;

        const result = await pool.query(query);
        return result.rows;
    },

    // Método para crear un nuevo usuario en la base de datos
    // Recibe un objeto con los datos ya validados y procesados por el service.
    async create(userData) {

        // Destructuramos explícitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes.
        const {
            userName,
            userEmail,
            userPhone,
            userDocumentTypes,
            userDocumentNumber,
            userPassword,
            userImage,
            userAvatarUrl,
            isStaff,
            isActive,
            isSuperuser,
        } = userData;

        // Usar placeholders ($1, $2, ...) en la consulta SQL evita inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos
        
        const query = `
            INSERT INTO users (
                user_name,
                user_email,
                user_phone,
                user_document_types,
                user_document_number,
                user_password,
                user_avatar_url,
                is_staff,
                is_active,
                is_superuser
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id;
        `;

        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE conlos placeholders en la consulta SQL
        const values = [
            userName,
            userEmail,
            userPhone,
            userDocumentTypes,
            userDocumentNumber,
            userPassword,
            userAvatarUrl,
            isStaff,
            isActive,
            isSuperuser,
        ];

        // Ejecutamos la consulta usando el pool
        // pool.query retorna un objeto con metadata y filas resultantes
        const result = await pool.query(query, values);

        // Devolvemos únicamente el primer registro retornado
        // En este caso contiene el id del usuario recién creado
        return result.rows[0];
    },
};
