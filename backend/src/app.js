// Importamos Express, el framework base para construir el servidor HTTP
import express from "express";

// Importamos el middleware CORS
// Permite controlar que origenes pueden comunicarse con el backend
import cors from "cors";

// Importamos las rutas del feature
// Cada feature expone su propio router independiente
import userRoutes from "./features/users/user.routes.js";
import authRoutes from "./features/auth/auth.routes.js";
import accessRoutes from "./features/access/access.routes.js";
import groupsRoutes from "./features/groups/groups.routes.js";
import permissionsRoutes from "./features/permissions/permissions.routes.js";

// Creamos la instancia principal de la aplicacion Express
const app = express();

// Middleware de CORS
// Permite solicitudes desde cualquier puerto local de desarrollo (5173, 5174, 5175, etc.)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Middleware para parsear cuerpos de peticion en formato JSON
// Sin este middleware, req.body seria undefined
app.use(express.json());

// Registro del router de usuarios
// Todas las rutas del feature users quedaran bajo el prefijo /api/users
// Ejemplo final: POST http://localhost:4000/api/users
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/permissions", permissionsRoutes);

// Exportamos la aplicacion configurada
// El arranque del servidor se hace en server.js
export default app;
