import { z } from "zod";
import { fileSchema } from "../../../shared/schemas/fileSchema";

// Contraseña con las mismas reglas del registro
const passwordRule = z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe contener al menos un caracter especial");

export const userSchema = z.object ({
    userName: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(60, "El nombre es demasiado largo"),

    userEmail: z
    .string()
    .email("Debe ingresar un email válido")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email válido"),


    userPhone: z
    .string()
    .regex(/^[0-9]{10}$/, "El telefono debe ser unicamente numeros"),

    userDocumentType: z.string().min(1, "Debe seleccionar un tipo de documento"),

    userDocumentNumber: z
    .string()
    .min(5, "Número de documento inválido")
    .max(20, "Número de documento demasiado largo"),

    userPassword: passwordRule,

    userImage: fileSchema.pick({ files:true }).shape.files.optional(),

    userAvatarUrl: z
    .string()
    .url("La url del avatar no es válida")
    .nullable()
    .optional(),


    isStaff: z.boolean(),

    isActive: z.boolean(),

    isSuperUser: z.boolean(),

})

// Schema de edición: mismos campos del registro,
// pero la contraseña es opcional (vacío = no cambiarla)
export const userEditSchema = userSchema.extend({
    userPassword: z
        .string()
        .max(100, "La contraseña es demasiado larga")
        .refine(
            (value) => value === "" || passwordRule.safeParse(value).success,
            "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial",
        ),
})
