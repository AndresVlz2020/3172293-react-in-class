-- database/migrations/0023_update_products_orders_display_name.sql
-- Asignar nombres amigables para los módulos Productos y Órdenes

UPDATE content_type
SET display_name =
  CASE app_label
    WHEN 'products' THEN 'Productos'
    WHEN 'orders' THEN 'Órdenes'
    ELSE display_name
  END
WHERE app_label IN ('products', 'orders');
