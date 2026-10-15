// Importamos el servicio de usuarios
// El controller nno implementa lógica de negocio,
// Solo delega la operación al service correspondiente.
import { userService } from "./user.service.js";

// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)
export const userController = {
    async getAll(req, res) {
        try {
            const users = await userService.getAll();
            res.json(users);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },
    // Método encargado de manejar la creación de un usuario
    // Se asume que este método será usado como handler de una ruta Express
    async create(req, res) {

    // Log del cuerpo de la petición
    // útil en desarrollo para validar que el frontend envía correctamente los datos
    // En producción suele reemplazarse por logging estructurado o eliminarse
    console.log("BODY RECIBIDO", req.body); // Clave

    try {
        // LLamamos al servicio de usuario, pasando los datos recibidos
        // Aquí ocurre la lógica real de negocio (validaciones, persistencia, etc..)

        const user = await userService.create(req.body);

        // Respuesta HTTP en caso de éxito
        // 201: recurso creado correctamente según el estándar REST
        res.status(201).json({
            // Mensaje informativo para el cliente
            message: "Usuario creado correctamente",

            // Retornamos únicamente el ID del usuario creado
            // Evita exponer información sensible innecesaria
            userID: user.id,
        });

    } catch (err) {
        // Capturamos cualquier error lanzado por el service o capas inferiores
        // Se registra el error completo para depuración en backend
        console.error("ERROR BACKEND:", err);

        // Respuesta HTTP de error genérico
        // 500: error interno del servidor 
        res.status(500).json({
            // Se envia un mensaje del error para diagnóstico
            // En producción suele mapearse a mensajes conntrolados
            error: err.message,
        });
      }
    },
};
