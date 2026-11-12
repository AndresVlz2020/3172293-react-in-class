import bcrypt from "bcrypt";
// El service es la capa donde vive la logica del negocio

// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia.

// pero el repository NO debe conocer el service.
import { userRepository } from "./user.repository.js";

// Exportamos el servicio de usuarios.
// El service representa la capa de lógica de negocio de la palicación.
export const userService = {

    // Método encargado de crear un usuario
    // Recibe datos provinientes del controller,
    // idealmente ya validados a nivel estructural (DTO / Schema)
    async createUser(data) {

        const hashedPassword = await bcrypt.hash(data.userPassword, 10);

        const userData = {
            ...data,
            userPassword: hashedPassword,
        };

        // En este punto, en una arquitectura real, deberián, ocurrir:
        // - Validaciones de reglas de negocio
        // - Transformaciones de datos (ej: hash de password)
        // - Verificaciones de unicidad (email, documento, etc.)
        // - Decisiones de negocio (roles, flags, estados iniciales)

        // Actualmente, el método solo delega directamente al repository,
        // sin agregar ninguna lógica adicional
        return await userRepository.create(userData);
    },

    async getAllUsers(options = {}) {
        return await userRepository.findAll(options);
    },

    async getUserById(userId) {
        return await userRepository.findById(userId);
    },

    async updateUser(userId, data) {
        const userData = { ...data };

        // Solo se hashea la contraseña si viene en la petición y no está vacía
        // (en edición, una contraseña vacía significa "no cambiarla")
        if (userData.userPassword) {
            userData.userPassword = await bcrypt.hash(userData.userPassword, 10);
        } else {
            delete userData.userPassword;
        }

        return await userRepository.update(userId, userData);
    },

    async updateStatus(userId, isActive) {
        return await userRepository.updateStatus(userId, isActive);
    },

    async getPermissionsByUserId(userId) {
        return await userRepository.getPermissionsByUserId(userId);
    },

    async updatePermissions(userId, permissionIds) {
        return await userRepository.updatePermissions(userId, permissionIds);
    },
};
