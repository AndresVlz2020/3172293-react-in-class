// Importamos el servicio de usuarios
// El controller NO implementa logica de negocio,
// Solo delega la operacion al service correspondiente
import { userService } from "./user.service.js";

// Exportamos un objeto controlador.
// Agrupar handlers es un objeto permite escalabilidad
// (create, update, delete, getById, etc.)
export const userController = {

    // Metodo encargado de manejar la creacion de un usuario
    // Se asume que este metodo sera usado como handler de una ruta Express
    async create(req, res) {

        // Log del cuerpo de la peticion
        // Util en desarrollo para validar que el frontend envia correctamente los datos
        // En produccion suele reemplazarse por logging estructurado o eliminarse
        console.log("BODY RECIBIDO: ", req.body); // CLAVE

        try {
            // Llamamos al servicio de usuario, pasando los datos recibidos
            // Aqui ocurre la logica real del negocio (validaciones, persistencia, etc.)
            const user = await userService.createUser(req.body);

            // Respuesta HTTP en caso de exito
            // 201: recurso creado correctamente segun el estandar REST
            res.status(201).json({
                // Mensaje informativo para el cliente
                message: "Usuario creado correctamente",

                // Retornamos unicamente el ID del usuario creado
                // Evita exponer informacion sensible innecesaria
                userID: user.id,
            });
        } catch (err) {
            // Capturamos cualquier error lanzado por el service o capas inferiores
            // Se registra el error completo para depuracion en backend
            console.error("ERROR BACKEND: ", err);

            // Respuesta HTTP de error generico
            // 500: error interno del servidor
            res.status(500).json({
                // Se envia el mensaje del error para diagnostico
                // En produccion suele mapearse a mensajes controlados
                error: err.message,
            })
        }
    }
}