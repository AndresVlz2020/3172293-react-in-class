// Importamos el repositorio de usuarios
// El service depende del repositorio para acceder a la persistencia
// Pero el repository no debe conocer el service

import { userRepository } from "./user.repository.js";

// Método encargado de crear usuarios
// Recibe datos provenientes del controller
// Idealmente ya validados a nivel estructural (schema)

export const userService = {

    async create(data) {

    // En este punto, en una arquitectura real, deberían ocurrir:
    // - Validaciones de las reglas de negocio
    // - Transformaciones de datos (ej: hashing de contraseñas)
    // - Verifcaciones de unicidad (ej: email, documento, etc...)
    // - Decisiones de negocio (ej: asignar roles, enviar emails, etc...)

    // Actualmente, el método solo delega directamente al repository
    // sin agregar ninguna lógica adicional.
    return await userRepository.create(data);
    },

    async getAll() {
        return await userRepository.getAll();
    },
};
