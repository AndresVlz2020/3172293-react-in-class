-- database/migrations/0026_insert_groups_default_permissions.sql
-- Asignar permisos iniciales a Administrador, Instructores y Aprendices

INSERT INTO group_permissions (group_id, permission_id)
SELECT g.group_id, p.permission_id
FROM groups g
CROSS JOIN permissions p
WHERE g.group_name = 'Administrador'
ON CONFLICT DO NOTHING;

INSERT INTO group_permissions (group_id, permission_id)
SELECT g.group_id, p.permission_id
FROM groups g
INNER JOIN permissions p
    ON p.permission_codename IN ('list_user', 'list_product', 'create_product', 'list_order')
WHERE g.group_name = 'Instructores'
ON CONFLICT DO NOTHING;

INSERT INTO group_permissions (group_id, permission_id)
SELECT g.group_id, p.permission_id
FROM groups g
INNER JOIN permissions p
    ON p.permission_codename IN ('list_product', 'list_order', 'create_order')
WHERE g.group_name = 'Aprendices'
ON CONFLICT DO NOTHING;
