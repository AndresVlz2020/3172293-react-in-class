-- database/migrations/0020_update_content_type_display_name.sql
-- Corrección: nombres amigables para la interfaz

UPDATE content_type
SET display_name =
  CASE app_label
    WHEN 'users' THEN 'Usuarios'
    WHEN 'groups' THEN 'Grupos'
    WHEN 'tasks' THEN 'Tareas'
    WHEN 'access' THEN 'Permisos'
  END;
