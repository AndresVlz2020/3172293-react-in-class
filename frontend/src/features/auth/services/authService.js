// frontend/src/features/auth/services/authService.js
// Consumir API login

import { API_URL } from "@/features/config";

const AUTH_API_URL = `${API_URL}/auth`;

export async function login(userData) {
    // Verificamos en consola qué datos están llegando desde el componente/formulario
    console.log("Datos enviados al servicio de Login:", userData);

    const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
            // Extraemos el valor soportando ambos nombres por si el formulario envía userEmail o email
            email: userData.email || userData.userEmail,
            password: userData.password || userData.userPassword,
        }),
        
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
    }

    return data;
    }