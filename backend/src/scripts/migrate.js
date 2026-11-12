// backend/src/scripts/migrate.js
import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

async function migrate() {
  try {
    // Limpiar tablas con nombres erróneos previos si existen
    await pool.query("DROP TABLE IF EXISTS group_permission CASCADE;");
    await pool.query("DROP TABLE IF EXISTS permission CASCADE;");

    // 1. content_type
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_type (
        content_type_id SERIAL PRIMARY KEY,
        app_label VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        display_name VARCHAR(100) NOT NULL DEFAULT '',
        CONSTRAINT uq_content_type UNIQUE (app_label, model)
      );
    `);

    await pool.query(`
      INSERT INTO content_type (app_label, model, display_name)
      VALUES
        ('users', 'user', 'Usuarios'),
        ('groups', 'group', 'Grupos'),
        ('tasks', 'task', 'Tareas'),
        ('access', 'permission', 'Permisos'),
        ('products', 'product', 'Productos'),
        ('orders', 'order', 'Órdenes')
      ON CONFLICT (app_label, model)
      DO UPDATE SET display_name = EXCLUDED.display_name;
    `);

    // 2. permissions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        permission_id SERIAL PRIMARY KEY,
        permission_name VARCHAR(150) NOT NULL,
        permission_codename VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        content_type_id INTEGER REFERENCES content_type(content_type_id)
      );
    `);

    await pool.query(`
      INSERT INTO permissions (permission_name, permission_codename, content_type_id)
      VALUES
        ('Listar usuarios', 'list_user', (SELECT content_type_id FROM content_type WHERE app_label = 'users' AND model = 'user')),
        ('Crear usuarios', 'create_user', (SELECT content_type_id FROM content_type WHERE app_label = 'users' AND model = 'user')),
        ('Generar Reporte usuarios', 'report_user', (SELECT content_type_id FROM content_type WHERE app_label = 'users' AND model = 'user')),
        ('Deshabilitar usuarios', 'disable_user', (SELECT content_type_id FROM content_type WHERE app_label = 'users' AND model = 'user')),
        ('Listar productos', 'list_product', (SELECT content_type_id FROM content_type WHERE app_label = 'products' AND model = 'product')),
        ('Crear productos', 'create_product', (SELECT content_type_id FROM content_type WHERE app_label = 'products' AND model = 'product')),
        ('Actualizar productos', 'update_product', (SELECT content_type_id FROM content_type WHERE app_label = 'products' AND model = 'product')),
        ('Deshabilitar productos', 'disable_product', (SELECT content_type_id FROM content_type WHERE app_label = 'products' AND model = 'product')),
        ('Listar órdenes', 'list_order', (SELECT content_type_id FROM content_type WHERE app_label = 'orders' AND model = 'order')),
        ('Crear órdenes', 'create_order', (SELECT content_type_id FROM content_type WHERE app_label = 'orders' AND model = 'order')),
        ('Actualizar órdenes', 'update_order', (SELECT content_type_id FROM content_type WHERE app_label = 'orders' AND model = 'order')),
        ('Cancelar órdenes', 'cancel_order', (SELECT content_type_id FROM content_type WHERE app_label = 'orders' AND model = 'order'))
      ON CONFLICT (permission_codename)
      DO UPDATE SET
        permission_name = EXCLUDED.permission_name,
        content_type_id = EXCLUDED.content_type_id;
    `);

    // 3. groups
    await pool.query(`
      CREATE TABLE IF NOT EXISTS groups (
        group_id SERIAL PRIMARY KEY,
        group_name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        is_active BOOLEAN NOT NULL DEFAULT TRUE
      );
    `);

    await pool.query(`
      ALTER TABLE groups
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
    `);

    // Eliminar Almacenista, Coordinador y Monitor
    await pool.query(`
      DELETE FROM groups
      WHERE group_name IN ('Almacenista', 'Coordinador', 'Monitor', 'Instructor', 'Aprendiz');
    `);

    await pool.query(`
      INSERT INTO groups (group_name)
      VALUES
        ('Administrador'),
        ('Instructores'),
        ('Aprendices')
      ON CONFLICT (group_name) DO NOTHING;
    `);

    // 4. group_permissions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS group_permissions (
        group_id INTEGER NOT NULL,
        permission_id INTEGER NOT NULL,
        PRIMARY KEY (group_id, permission_id),
        CONSTRAINT fk_group_permissions_group
          FOREIGN KEY (group_id)
          REFERENCES groups(group_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_group_permissions_permission
          FOREIGN KEY (permission_id)
          REFERENCES permissions(permission_id)
          ON DELETE CASCADE
      );
    `);

    // 5. user_groups
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_groups (
        user_id INTEGER NOT NULL,
        group_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, group_id),
        CONSTRAINT fk_user_groups_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_user_groups_group
          FOREIGN KEY (group_id)
          REFERENCES groups(group_id)
          ON DELETE CASCADE
      );
    `);

    // 6. user_permissions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_permissions (
        user_id INTEGER NOT NULL,
        permission_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, permission_id),
        CONSTRAINT fk_user_permissions_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_user_permissions_permission
          FOREIGN KEY (permission_id)
          REFERENCES permissions(permission_id)
          ON DELETE CASCADE
      );
    `);

    // 7. Seed initial users if empty
    const userCount = await pool.query("SELECT COUNT(*) FROM users;");
    if (Number(userCount.rows[0].count) === 0) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      const u1 = await pool.query(
        `INSERT INTO users (user_name, user_email, user_phone, user_document_types, user_document_number, user_password, is_staff, is_active, is_superuser)
         VALUES ($1, $2, $3, $4, $5, $6, true, true, true) RETURNING id;`,
        ["Andrés Vélez", "santyguitar6@gmail.com", "3101234567", "CC", "1001234567", hashedPassword]
      );

      const u2 = await pool.query(
        `INSERT INTO users (user_name, user_email, user_phone, user_document_types, user_document_number, user_password, is_staff, is_active, is_superuser)
         VALUES ($1, $2, $3, $4, $5, $6, true, true, false) RETURNING id;`,
        ["Edwar Velásquez", "edwar@sena.edu.co", "3152345678", "CC", "1002345678", hashedPassword]
      );

      await pool.query(
        `INSERT INTO users (user_name, user_email, user_phone, user_document_types, user_document_number, user_password, is_staff, is_active, is_superuser)
         VALUES ($1, $2, $3, $4, $5, $6, false, true, false) RETURNING id;`,
        ["Michael Aprendiz", "michael@sena.edu.co", "3209876543", "TI", "1003456789", hashedPassword]
      );

      await pool.query(
        "INSERT INTO user_groups (user_id, group_id) VALUES ($1, 1) ON CONFLICT DO NOTHING;",
        [u1.rows[0].id]
      );

      await pool.query(
        "INSERT INTO user_permissions (user_id, permission_id) VALUES ($1, 1), ($1, 2) ON CONFLICT DO NOTHING;",
        [u2.rows[0].id]
      );
    }

    // Permisos iniciales para Administrador, Instructores y Aprendices
    await pool.query(`
      INSERT INTO group_permissions (group_id, permission_id)
      SELECT g.group_id, p.permission_id
      FROM groups g
      CROSS JOIN permissions p
      WHERE g.group_name = 'Administrador'
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO group_permissions (group_id, permission_id)
      SELECT g.group_id, p.permission_id
      FROM groups g
      INNER JOIN permissions p ON p.permission_codename IN ('list_user', 'list_product', 'create_product', 'list_order')
      WHERE g.group_name = 'Instructores'
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO group_permissions (group_id, permission_id)
      SELECT g.group_id, p.permission_id
      FROM groups g
      INNER JOIN permissions p ON p.permission_codename IN ('list_product', 'list_order', 'create_order')
      WHERE g.group_name = 'Aprendices'
      ON CONFLICT DO NOTHING;
    `);

    console.log("Migraciones y datos iniciales aplicados correctamente en PostgreSQL.");
  } catch (err) {
    console.error("Error en migración:", err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
