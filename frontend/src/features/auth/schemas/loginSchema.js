// src/features/auth/schemas/loginSchema.js

import { z } from "zod";

export const loginSchema = z.object({

    userEmail: z.email("Debe ingresar un email válido"),

    userPassword: z.string().min(1, "La contraseña es obligatoria"),

})