import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

async function resetOneUser() {
  const email = String(process.env.RESET_USER_EMAIL || "").trim();
  const newPassword = process.env.RESET_USER_PASSWORD;

  if (!email || !newPassword) {
    throw new Error(
      "Define RESET_USER_EMAIL y RESET_USER_PASSWORD para restablecer una sola cuenta.",
    );
  }

  if (newPassword.length < 8) {
    throw new Error("La nueva contraseña debe tener al menos 8 caracteres.");
  }

  try {
    const hash = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      `UPDATE users
       SET user_password = $1
       WHERE LOWER(TRIM(user_email)) = LOWER(TRIM($2))
       RETURNING id;`,
      [hash, email],
    );

    if (result.rowCount !== 1) {
      throw new Error("No se encontró exactamente una cuenta para ese correo.");
    }

    console.log("Contraseña actualizada para una cuenta.");
  } finally {
    await pool.end();
  }
}

resetOneUser().catch((error) => {
  console.error("No se pudo actualizar la contraseña:", error.message);
  process.exitCode = 1;
});
