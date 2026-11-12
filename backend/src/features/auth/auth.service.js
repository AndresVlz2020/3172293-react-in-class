// backend/src/features/auth/auth.service.js
// Lógica de autenticación + JWT

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository.js";

export const authService = {
  async login(credentials = {}) {
    const identifier = String(
      credentials.email ||
      credentials.userEmail ||
      credentials.user_email ||
      credentials.username ||
      credentials.user_name ||
      ""
    ).trim();

    const password = String(
      credentials.password ||
      credentials.userPassword ||
      credentials.user_password ||
      ""
    );

    if (!identifier || !password) {
      throw new Error("Credenciales inválidas");
    }

    const user = await authRepository.findByEmail(identifier);

    if (!user || !user.password) {
      throw new Error("Credenciales inválidas");
    }

    // Comparar contra el hash real almacenado en la base de datos PostgreSQL
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Credenciales inválidas");
    }

    if (!user.is_active) {
      throw new Error("Usuario inactivo");
    }

    const isAdmin = Boolean(user.is_superuser || user.is_admin_group);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.user_email,
        isSuperuser: Boolean(user.is_superuser),
        isAdmin,
      },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: process.env.JWT_EXPIRES || "1h" },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.user_name,
        email: user.user_email,
        isSuperuser: Boolean(user.is_superuser),
        isAdmin,
      },
    };
  },
};
