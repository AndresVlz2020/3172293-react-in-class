-- database/migrations/0014_insert_additional_user_permissions.sql

INSERT INTO permissions (permission_name, permission_codename)
VALUES
    ('Generar Reporte usuarios', 'report_user'),
    ('Deshabilitar usuarios', 'disable_user');
