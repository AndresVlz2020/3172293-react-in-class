// Importamos router desde Express.
// Router permite modularizar las rutas por feature
// Y mantener el archivo principal de la app limpio
import { Router } from "express";

// Importamos el controlador de usuarios.
// El router nunca implementa la logica.
// Solo delega la ejecucion al controller.
import { userController } from "./user.controller.js";

// Creamos una instancia del router de Express
const router = Router();

// Definimos la ruta para crear un usuario
// POST / users
// Cuando se recibe una peticion POST en la raiz del recurso.
// Express ejecuta el metodo create del controller.
router.post("/", userController.create);

// Exportamos el router para ser registrado en la aplicacion principal
// (ej: app.use("/users", router))
export default router;