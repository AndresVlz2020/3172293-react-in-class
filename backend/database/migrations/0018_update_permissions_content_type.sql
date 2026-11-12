-- database/migrations/0018_update_permissions_content_type.sql
-- Corrección: asociar permisos de usuarios a users.user

UPDATE permissions
SET content_type_id = 1
WHERE permission_codename IN (
    'list_user',
    'create_user',
    'report_user',
    'disable_user'
);
