-- database/migrations/0025_insert_orders_permissions.sql
-- Crear permisos para el Módulo Órdenes y asociarlos a content_type (orders.order)

INSERT INTO permissions (permission_name, permission_codename, content_type_id)
VALUES
    (
        'Listar órdenes',
        'list_order',
        (SELECT content_type_id FROM content_type WHERE app_label = 'orders' AND model = 'order')
    ),
    (
        'Crear órdenes',
        'create_order',
        (SELECT content_type_id FROM content_type WHERE app_label = 'orders' AND model = 'order')
    ),
    (
        'Actualizar órdenes',
        'update_order',
        (SELECT content_type_id FROM content_type WHERE app_label = 'orders' AND model = 'order')
    ),
    (
        'Cancelar órdenes',
        'cancel_order',
        (SELECT content_type_id FROM content_type WHERE app_label = 'orders' AND model = 'order')
    )
ON CONFLICT (permission_codename)
DO UPDATE SET
    permission_name = EXCLUDED.permission_name,
    content_type_id = EXCLUDED.content_type_id;
