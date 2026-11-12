// Componente reutilizable que muestra un switch para activar o desactivar estados
import { StatusSwitch, showConfirmAlert, showSuccessAlert, showErrorAlert } from "@/shared";

// Componente que contiene los botones de acciones para cada usuario
import UserRowActions from "../components/UserRowActions";
import { updateUserStatus } from "../services/userServices";

// Generador de columnas con soporte para sincronizar el estado en React y PostgreSQL
export const getUserColumns = (onStatusUpdated) => [
  // Columna ID
  {
    accessorKey: "id", // Propiedad del objeto user que se mostrará en la columna
    header: "Id",      // Título de la columna
  },

  // Columna Nombre
  {
    accessorKey: "name", // Campo del objeto user
    header: "Nombre",    // Encabezado visible
  },

  // Columna Email
  {
    accessorKey: "email",
    header: "Email",
  },

  // Columna Teléfono
  {
    accessorKey: "phone",
    header: "Teléfono",
  },

  // Columna Estado (activo / inactivo)
  {
    accessorKey: "isActive",
    header: "Estado",

    // Render personalizado de la celda
    // Permite mostrar un componente en lugar de solo texto
    cell: ({ row }) => {
      // Se obtiene el objeto completo del usuario de la fila
      const user = row.original;
      const currentStatus = Boolean(user.isActive ?? user.is_active ?? true);

      // Función que se ejecuta cuando se toca el switch: confirma primero con SweetAlert
      const handleChange = async (value) => {
        const nextStatus = Boolean(value);
        const actionText = nextStatus ? "habilitar" : "inhabilitar";
        const userName = user.name || user.userName || user.user_name || user.email || user.user_email || "usuario";

        const result = await showConfirmAlert({
          title: `¿Desea ${actionText} a este usuario?`,
          text: `¿Está seguro de que desea ${actionText} al usuario "${userName}"?`,
          confirmButtonText: nextStatus ? "Sí, habilitar" : "Sí, inhabilitar",
          cancelButtonText: "Cancelar",
          isDestructive: !nextStatus,
        });

        if (!result.isConfirmed) {
          return;
        }

        try {
          const response = await updateUserStatus(user.id, nextStatus);
          const confirmedStatus = Boolean(
            response?.user?.isActive ?? response?.user?.is_active ?? nextStatus,
          );

          user.isActive = confirmedStatus;
          user.is_active = confirmedStatus;
          onStatusUpdated?.(user.id, confirmedStatus);

          await showSuccessAlert({
            title: "Estado actualizado",
            text: `El usuario "${userName}" fue ${nextStatus ? "habilitado" : "inhabilitado"} exitosamente.`,
          });
        } catch (error) {
          await showErrorAlert({
            title: "Error al actualizar estado",
            text: error.message || "No se pudo actualizar el estado del usuario",
          });
        }
      };

      return (
        // Componente reutilizable para mostrar el switch
        <StatusSwitch
          checked={currentStatus}  // Estado actual del usuario en PostgreSQL
          onChange={handleChange}  // Función que maneja el cambio
        />
      );
    },
  },

  // Columna de acciones (editar)
  {
    id: "actions", // No usa accessorKey porque no corresponde a un campo del usuario

    // Renderiza el componente de acciones pasando el usuario completo
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];

export const userColumns = getUserColumns();
