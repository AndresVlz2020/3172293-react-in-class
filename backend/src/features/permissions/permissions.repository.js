// backend/src/features/permissions/permissions.repository.js
// Corrección: incluir información del módulo

import { pool } from "../../config/db.js";

export const permissionsRepository = {
  async getAll() {
    const query = `
      SELECT
        p.permission_id,
        p.permission_name,
        p.permission_codename,
        ct.content_type_id,
        ct.app_label,
        ct.model,
        ct.display_name
      FROM permissions p
      INNER JOIN content_type ct
        ON ct.content_type_id = p.content_type_id
      ORDER BY
        CASE ct.app_label
          WHEN 'users' THEN 1
          WHEN 'products' THEN 2
          WHEN 'orders' THEN 3
          ELSE 4
        END,
        p.permission_id;
    `;

    const result = await pool.query(query);

    return result.rows;
  },
};
