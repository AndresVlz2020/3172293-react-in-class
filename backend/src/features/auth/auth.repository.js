// backend/src/features/auth/auth.repository.js

import { pool } from "../../config/db.js";

export const authRepository = {
  async findByEmail(identifier) {
    const cleanId = String(identifier || "").trim().toLowerCase();

    const query = `
      SELECT
        u.id,
        u.user_name,
        u.user_email,
        u.user_password AS password,
        u.is_active,
        u.is_staff,
        u.is_superuser,
        EXISTS (
          SELECT 1
          FROM user_groups ug
          INNER JOIN groups g ON g.group_id = ug.group_id
          WHERE ug.user_id = u.id
            AND g.group_name = 'Administrador'
        ) AS is_admin_group
      FROM users u
      WHERE LOWER(TRIM(u.user_email)) = $1
         OR LOWER(TRIM(COALESCE(u.user_document_number, ''))) = $1
         OR LOWER(TRIM(u.user_name)) = $1
      ORDER BY CASE
        WHEN LOWER(TRIM(u.user_email)) = $1 THEN 0
        WHEN LOWER(TRIM(COALESCE(u.user_document_number, ''))) = $1 THEN 1
        ELSE 2
      END
      LIMIT 1;
    `;

    const result = await pool.query(query, [cleanId]);
    return result.rows[0] || null;
  },
};
