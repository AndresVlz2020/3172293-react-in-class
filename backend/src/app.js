// Importamos Express, el framework base para construir el servidor HTTP
import express from "express";

// Importamos el middleware CORS
// Permite controlar que origenes pueden comunicarse con el backend
import cors from "cors";

// Importamos las rutas del feature users
// Cada feature expone su propio router independiente
import userRoutes from "./features/users/user.routes.js";
import authRoutes from "./features/auth/auth.routes.js"

// Creamos la instancia principal de la aplicacion Express
const app = express();

// Middleware de CORS
// Permite solicitudes unicamente desde el frontend en localhost:5173
// (tipico proyecto de vite en desarrollo)
app.use(cors({ origin: "http://localhost:5173" }));

// Middleware para parsear cuerpos de peticion en formato JSON
// Sin este middleware, req.body seria undefined
app.use(express.json());

// Registro del router de usuarios
// Todas las rutas del feature users quedaran bajo el prefijo /api/users
// Ejemplo final: POST http://localhost:4000/api/users
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Exportamos la aplicacion configurada
// El arranque del servidor se hace en server.js
export default app;