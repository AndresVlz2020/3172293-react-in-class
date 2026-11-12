-- database/migrations/0015_create_content_type.sql
-- Corrección: creación de la tabla content_type

CREATE TABLE content_type (
    content_type_id SERIAL PRIMARY KEY,

    app_label VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,

    -- Evita valores duplicados en la columna.
    CONSTRAINT uq_content_type
    UNIQUE (app_label, model)
);
