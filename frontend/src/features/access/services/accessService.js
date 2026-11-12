// frontend/src/features/access/services/accessService.js

import { API_URL } from "@/features/config";

export async function hasPermission(permissionCode) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${API_URL}/access/check/${permissionCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error verificando permiso");
  }

  return response.json();
}
