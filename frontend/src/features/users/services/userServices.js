// URL base del endpoint de usuarios en el backend
// En desarrollo apunta al servidor express local
// En producción debería provenir de variables de entorno 
// const API_URL = "http://localhost:4000/api/users";

import { API_URL } from "../../config";

const USERS_URL = `${API_URL}/users`;

export async function getUserById(userId) {
    const response = await fetch(`${USERS_URL}/${userId}`, {
        cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al consultar el usuario");
    }

    return {
        ...data,
        isActive: Boolean(data.isActive ?? data.is_active ?? true),
    };
}

export async function getUsers({ activeOnly = false } = {}) {
    const url = activeOnly ? `${USERS_URL}?active=true` : USERS_URL;
    const response = await fetch(url, {
        cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al consultar los usuarios");
    }

    if (!Array.isArray(data)) {
        throw new Error("La API devolvió una respuesta de usuarios inválida");
    }

    return data.map((user) => ({
        ...user,
        isActive: Boolean(user.isActive ?? user.is_active ?? true),
    }));
}

// Función para actualizar el estado activo/inactivo de un usuario en PostgreSQL en tiempo real
export async function updateUserStatus(userId, isActive) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${USERS_URL}/${userId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ isActive: Boolean(isActive) }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar el estado del usuario");
    }

    return response.json();
}

// Función para actualizar los datos de un usuario existente en el backend
// Si userPassword viene vacío, el backend mantiene la contraseña actual
export async function updateUser(userId, userData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${USERS_URL}/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userData),
    });

    const error = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(error.error || "Error al actualizar el usuario");
    }

    return error;
}

// Función para crar un usuario en el backend
// Recibe un objeto con los datos del usuario
// Retorna la respuesta JSON del servidor
export async function createUser(userData) {
    // Enviar JWT al backend
    const token = sessionStorage.getItem("token");

    // Realizamos la petición HTTP usando fetch
    const response = await fetch(USERS_URL, {
        // método HTTP según convención REST
        method: "POST",

        // Cabeceras de la petición
        // Indicamos que enviamos JSON
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

        // Convertimos el objeto userData a JSON
        body: JSON.stringify(userData),
    });

    // Verificamos si la respuesta NO fue exitosa (status !=2xx)
    if (!response.ok) {
        // Leemos el cuerpo de la respuesta de error
        const error = await response.json();

        // Lanzamos una excepción con el mensaje de error 
        // Esto permite que el componente que llama maneje el error con try/catch
        throw new Error(error.error || "Error al crear el usuario");
    }

    // Si la petición fue exitosa, retornamos la respuesta parseada como JSON
    return response.json();
}
