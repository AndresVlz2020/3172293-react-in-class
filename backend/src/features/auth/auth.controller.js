// backend/src/features/auth/auth.controller.js
// endpoint login

import { authService } from "./auth.service.js";

export const authController = {
    async login(req, res) {
        try {
            const result = await authService.login(req.body);

            res.status(200).json({
                message: "Login Exitoso",
                ...result,
            });
        } catch (err) {
            const status =
                err.message === "Credenciales inválidas" ? 401 :
                err.message === "Usuario inactivo" ? 403 : 500;

            res.status(status).json({
                error: status === 500
                    ? "Error interno al iniciar sesión"
                    : err.message,
            });
        }
    }
}