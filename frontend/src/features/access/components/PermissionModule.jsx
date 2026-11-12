// frontend/src/features/access/components/PermissionModule.jsx
// Corrección: se usa estado global desde AccessPage

import { Checkbox, Button, IconButton } from "@/shared";
import { Pencil } from "lucide-react";

const DEFAULT_PERMISSIONS = [
  { permission_id: 1, permission_name: "Listar usuarios", permission_codename: "list_user", display_name: "Usuarios" },
  { permission_id: 2, permission_name: "Crear usuarios", permission_codename: "create_user", display_name: "Usuarios" },
  { permission_id: 3, permission_name: "Generar Reporte usuarios", permission_codename: "report_user", display_name: "Usuarios" },
  { permission_id: 4, permission_name: "Deshabilitar usuarios", permission_codename: "disable_user", display_name: "Usuarios" },
  { permission_id: 5, permission_name: "Listar productos", permission_codename: "list_product", display_name: "Productos" },
  { permission_id: 6, permission_name: "Crear productos", permission_codename: "create_product", display_name: "Productos" },
  { permission_id: 7, permission_name: "Actualizar productos", permission_codename: "update_product", display_name: "Productos" },
  { permission_id: 8, permission_name: "Deshabilitar productos", permission_codename: "disable_product", display_name: "Productos" },
  { permission_id: 9, permission_name: "Listar órdenes", permission_codename: "list_order", display_name: "Órdenes" },
  { permission_id: 10, permission_name: "Crear órdenes", permission_codename: "create_order", display_name: "Órdenes" },
  { permission_id: 11, permission_name: "Actualizar órdenes", permission_codename: "update_order", display_name: "Órdenes" },
  { permission_id: 12, permission_name: "Cancelar órdenes", permission_codename: "cancel_order", display_name: "Órdenes" },
];

export default function PermissionModule({
  selectedGroup,
  selectedGroupName,
  selectedUser,
  selectedUserName,
  isEditing,
  allPermissions = [],
  permissionsDraft,
  setPermissionsDraft,
  onEdit,
  onCancel,
  onSave,
}) {
  const catalog = allPermissions.length > 0 ? allPermissions : DEFAULT_PERMISSIONS;

  const hasPermission = (codename) => {
    return permissionsDraft.some(
      (permission) => permission.permission_codename === codename,
    );
  };

  const handlePermissionChange = (permission, checked) => {
    const codename = permission.permission_codename;

    if (!checked) {
      setPermissionsDraft((prev) =>
        prev.filter((item) => item.permission_codename !== codename),
      );
      return;
    }

    setPermissionsDraft((prev) => [...prev, permission]);
  };

  // Agrupar permisos por módulo
  const permissionsByModule = catalog.reduce(
    (groupedPermissions, permission) => {
      const moduleName = permission.display_name || "Usuarios"; // clave de agrupación

      // inicializa el arreglo si el módulo no existe
      if (!groupedPermissions[moduleName]) {
        groupedPermissions[moduleName] = [];
      }

      groupedPermissions[moduleName].push(permission); // agrega el permiso al módulo

      return groupedPermissions; // retorna el acumulador en cada iteración
    },
    {},
  ); // {} = objeto inicial

  const activeName = selectedGroupName || selectedUserName;
  const activeTypeLabel = selectedUser ? "Usuario" : "Grupo";

  return (
    <section className="border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-neutral-500">{activeTypeLabel}</p>

          <h2 className="text-lg font-semibold">
            {activeName || "Seleccione un grupo"}
          </h2>
        </div>

        {!isEditing && (selectedGroup || selectedUser || activeName) && (
          <IconButton ariaLabel="Editar permisos" onClick={onEdit}>
            <Pencil size={20} />
          </IconButton>
        )}
      </div>

      <div className="space-y-8">
        {Object.entries(permissionsByModule).map(
          ([moduleName, permissions]) => (
            <div key={moduleName} className="border-b-2 pb-6">
              <h3 className="font-medium mb-4">Módulo {moduleName}</h3>

              <div className="flex flex-wrap gap-6">
                {permissions.map((permission) => (
                  <Checkbox
                    key={permission.permission_id}
                    id={permission.permission_codename}
                    name={permission.permission_codename}
                    label={permission.permission_name}
                    checked={hasPermission(permission.permission_codename)}
                    disabled={!isEditing}
                    onChange={(e) =>
                      handlePermissionChange(permission, e.target.checked)
                    }
                  />
                ))}
              </div>
            </div>
          ),
        )}
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3 mt-8">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>

          <Button type="button" variant="primary" onClick={onSave}>
            Guardar
          </Button>
        </div>
      )}
    </section>
  );
}
