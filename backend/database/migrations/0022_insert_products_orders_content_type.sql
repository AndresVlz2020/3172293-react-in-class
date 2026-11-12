-- database/migrations/0022_insert_products_orders_content_type.sql
-- Registrar los nuevos módulos products y orders en content_type

INSERT INTO content_type (
    app_label,
    model
)
VALUES
    ('products', 'product'),
    ('orders', 'order')
ON CONFLICT (app_label, model) DO NOTHING;
