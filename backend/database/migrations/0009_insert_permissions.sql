-- database/migrations/0009_insert_permissions.sql

INSERT INTO permissions (permission_name, permission_codename)
VALUES
('Listar usuarios', 'list_user'),
('Crear usuarios', 'create_user');
