-- database/migrations/0024_insert_products_permissions.sql
-- Crear permisos para el Módulo Productos y asociarlos a content_type (products.product)

INSERT INTO permissions (permission_name, permission_codename, content_type_id)
VALUES
    (
        'Listar productos',
        'list_product',
        (SELECT content_type_id FROM content_type WHERE app_label = 'products' AND model = 'product')
    ),
    (
        'Crear productos',
        'create_product',
        (SELECT content_type_id FROM content_type WHERE app_label = 'products' AND model = 'product')
    ),
    (
        'Actualizar productos',
        'update_product',
        (SELECT content_type_id FROM content_type WHERE app_label = 'products' AND model = 'product')
    ),
    (
        'Deshabilitar productos',
        'disable_product',
        (SELECT content_type_id FROM content_type WHERE app_label = 'products' AND model = 'product')
    )
ON CONFLICT (permission_codename)
DO UPDATE SET
    permission_name = EXCLUDED.permission_name,
    content_type_id = EXCLUDED.content_type_id;
