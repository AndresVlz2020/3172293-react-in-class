-- database/migrations/0021_insert_instructores_aprendices_groups.sql
-- Agregar grupos de usuarios Instructores y Aprendices

INSERT INTO groups (group_name)
VALUES
    ('Instructores'),
    ('Aprendices')
ON CONFLICT (group_name) DO NOTHING;
