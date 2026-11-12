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

            res.status(500).json({
                // Se envia el mensaje del error para diagnostico
                // En produccion suele mapearse a mensajes controlados
                error: err.message,
            });
        }
    },

    async getAll(req, res) {
        try {
            const activeOnly =
                req.query.active === "true" || req.query.activeOnly === "true";
            const users = await userService.getAllUsers({ activeOnly });
            res.status(200).json(users);
        } catch (err) {
            console.error("ERROR BACKEND GET ALL: ", err);
            res.status(500).json({
                error: err.message,
            });
        }
    },

    async getById(req, res) {
        try {
            const userId = Number(req.params.userId);

            if (!userId || Number.isNaN(userId)) {
                return res.status(400).json({
                    error: "ID de usuario inválido",
                });
            }

            const user = await userService.getUserById(userId);

            if (!user) {
                return res.status(404).json({
                    error: "Usuario no encontrado",
                });
            }

            res.status(200).json(user);
        } catch (err) {
            console.error("ERROR BACKEND GET BY ID: ", err);
            res.status(500).json({
                error: err.message,
            });
        }
    },

    // Actualizar los datos completos de un usuario
    async update(req, res) {
        try {
            const userId = Number(req.params.userId);

            if (!userId || Number.isNaN(userId)) {
                return res.status(400).json({
                    error: "ID de usuario inválido",
                });
            }

            const updated = await userService.updateUser(userId, req.body);

            if (!updated) {
                return res.status(404).json({
                    error: "Usuario no encontrado",
                });
            }

            res.status(200).json({
                message: "Usuario actualizado correctamente",
                user: updated,
            });
        } catch (err) {
            // Violación de restricción única (correo ya registrado)
            if (err?.code === "23505") {
                return res.status(409).json({
                    error: "El correo electrónico ya está registrado",
                });
            }

            console.error("ERROR BACKEND UPDATE: ", err);
            res.status(500).json({
                error: "Error actualizando el usuario",
            });
        }
    },

    // Actualizar estado activo/inactivo de usuario en tiempo real
    async updateStatus(req, res) {
        try {
            const userId = Number(req.params.userId);
            const { isActive } = req.body;

            if (!userId || Number.isNaN(userId)) {
                return res.status(400).json({
                    error: "ID de usuario inválido",
                });
            }

            const updated = await userService.updateStatus(userId, Boolean(isActive));

            if (!updated) {
                return res.status(404).json({
                    error: "Usuario no encontrado",
                });
            }

            res.status(200).json({
                message: "Estado del usuario actualizado correctamente",
                user: updated,
            });
        } catch (error) {
            console.error("ERROR BACKEND UPDATE STATUS:", error);
            res.status(500).json({
                error: "Error actualizando el estado del usuario",
            });
        }
    },

    // Permisos de usuario
    async getPermissionsByUserId(req, res) {
        try {
            const userId = Number(req.params.userId);
            const permissions = await userService.getPermissionsByUserId(userId);
            res.json(permissions);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Error obteniendo permisos del usuario",
            });
        }
    },

    // Actualizar permisos de usuario
    async updatePermissions(req, res) {
        try {
            const userId = Number(req.params.userId);
            const { permissionIds } = req.body;

            await userService.updatePermissions(userId, permissionIds);

            res.status(200).json({
                message: "Permisos del usuario actualizados correctamente",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Error actualizando permisos del usuario",
            });
        }
    },
};
