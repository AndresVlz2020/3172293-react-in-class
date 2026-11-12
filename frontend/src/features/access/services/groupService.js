// frontend/src/features/access/services/groupService.js

const API_URL = "http://localhost:4000/api/groups";

export async function getGroups() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error obteniendo grupos");
  }

  return response.json();
}

// función para actualizar permisos.
export async function updateGroupPermissions(groupId, permissionIds) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${API_URL}/${groupId}/permissions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      permissionIds,
    }),
  });

  if (!response.ok) {
    throw new Error("Error actualizando permisos del grupo");
  }

  return response.json();
}
