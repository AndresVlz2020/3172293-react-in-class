// backend/src/features/auth/auth.service.js
//Lógica de autenticación + JWT

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository.js";

export const authService = {
    async login({ email, password }) {
        const user = await authRepository.findByEmail(email);

        console.log("USER ENCONTRADO:", user);

        if (!user) {
        throw new Error("Credenciales inválidas");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = password === user.password;

        if (!isMatch) {
        throw new Error("Credenciales inválidas");
        }

        if (!user.is_active) {
        throw new Error("Usuario inactivo");
        }

        const token = jwt.sign(
        { id: user.id, email: user.user_email },
        process.env.JWT_SECRET || "default_jwt_secret",
        { expiresIn: process.env.JWT_EXPIRES || "1h" },
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.user_email,
            },
        };
    },
};