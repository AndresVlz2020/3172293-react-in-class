// Importamos el pool de conexion a PostgreSQL
// Este pool es una instancia compartida configurada en la capa de infraestructura
import { pool } from "../../config/db.js";

// Exportamos el repositorio de usuarios
// El repository encapsula todos las consultas SQL relacionadas con users.
export const userRepository = {

    // Metodo encargado de crear un usuario en la base de datos
    // Recibe un objeto con los datos ya validados y procesados por el service
    async create(userData) {

        // Desestructuramos explicitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
        const {
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
        } = userData;

        // Usar placeholders ($1, $2, ...) previene inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos (id)
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
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING id;
        `;

        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
        const values = [
            userName,
            userEmail,
            userPhone,
            userDocumentTypes,
            userDocumentNumber,
            userPassword,
            userAvatarUrl,
            Boolean(isStaff),
            isActive !== undefined ? Boolean(isActive) : true,
            Boolean(isSuperuser),
        ];

        // Ejecutamos la consulta usando al query
        // pool.query retorna un objeto con metadata y filas resultantes
        const result = await pool.query(query, values);

        // Devolvemos unicamente el primer registro retornado
        // En este caso contiene el id del usuario recien creado
        return result.rows[0];
    },

    async findAll({ activeOnly = false } = {}) {
        const query = `
            SELECT 
                id,
                user_name AS name,
                user_email AS email,
                user_phone AS phone,
                user_document_types AS document_type,
                user_document_number AS document_number,
                is_staff AS "isStaff",
                COALESCE(is_active, TRUE) AS "isActive",
                is_superuser AS "isSuperUser",
                created_at
            FROM users
            WHERE ($1::boolean IS FALSE OR COALESCE(is_active, TRUE) = TRUE)
            ORDER BY id ASC;
        `;
        const result = await pool.query(query, [Boolean(activeOnly)]);
        return result.rows;
    },

    // Obtener un usuario por ID (sin exponer el hash de la contraseña)
    async findById(userId) {
        const query = `
            SELECT 
                id,
                user_name AS name,
                user_email AS email,
                user_phone AS phone,
                user_document_types AS document_type,
                user_document_number AS document_number,
                is_staff AS "isStaff",
                COALESCE(is_active, TRUE) AS "isActive",
                is_superuser AS "isSuperUser",
                created_at
            FROM users
            WHERE id = $1;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    },

    // Actualizar los datos de un usuario existente
    // Solo se actualizan los campos presentes en userData
    async update(userId, userData) {
        const columnMap = {
            userName: "user_name",
            userEmail: "user_email",
            userPhone: "user_phone",
            userDocumentTypes: "user_document_types",
            userDocumentNumber: "user_document_number",
            userPassword: "user_password",
            userAvatarUrl: "user_avatar_url",
        };

        const setClauses = [];
        const values = [];

        for (const [key, column] of Object.entries(columnMap)) {
            if (userData[key] !== undefined) {
                values.push(userData[key]);
                setClauses.push(`${column} = $${values.length}`);
            }
        }

        // Campos booleanos (se aceptan aunque vengan en false)
        if (userData.isStaff !== undefined) {
            values.push(Boolean(userData.isStaff));
            setClauses.push(`is_staff = $${values.length}`);
        }

        if (userData.isActive !== undefined) {
            values.push(Boolean(userData.isActive));
            setClauses.push(`is_active = $${values.length}`);
        }

        if (userData.isSuperuser !== undefined) {
            values.push(Boolean(userData.isSuperuser));
            setClauses.push(`is_superuser = $${values.length}`);
        }

        if (setClauses.length === 0) {
            return this.findById(userId);
        }

        values.push(userId);

        const query = `
            UPDATE users
            SET ${setClauses.join(", ")}
            WHERE id = $${values.length}
            RETURNING id;
        `;

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return undefined;
        }

        return this.findById(userId);
    },

    // Actualizar estado activo/inactivo del usuario en PostgreSQL
    async updateStatus(userId, isActive) {
        const query = `
            UPDATE users
            SET is_active = $1
            WHERE id = $2
            RETURNING id, is_active AS "isActive";
        `;
        const result = await pool.query(query, [Boolean(isActive), userId]);
        return result.rows[0];
    },

    // Obtener permisos directos del usuario por ID
    async getPermissionsByUserId(userId) {
        const query = `
            SELECT
                p.permission_id,
                p.permission_name,
                p.permission_codename
            FROM user_permissions up
            INNER JOIN permissions p
                ON p.permission_id = up.permission_id
            WHERE up.user_id = $1
            ORDER BY p.permission_name;
        `;

        const result = await pool.query(query, [userId]);

        return result.rows;
    },

    // Actualizar permisos directos del usuario
    async updatePermissions(userId, permissionIds) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            await client.query(
                `
                DELETE FROM user_permissions
                WHERE user_id = $1
                `,
                [userId],
            );

            for (const permissionId of permissionIds) {
                await client.query(
                    `
                    INSERT INTO user_permissions (
                        user_id,
                        permission_id
                    )
                    VALUES ($1, $2)
                    `,
                    [userId, permissionId],
                );
            }

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    },
};
