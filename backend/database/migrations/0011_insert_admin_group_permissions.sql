-- database/migrations/0011_insert_admin_group_permissions.sql

INSERT INTO group_permissions (
    group_id,
    permission_id
)
SELECT
    1,
    permission_id
FROM permissions
WHERE permission_codename IN (
    'list_user',
    'create_user'
);
