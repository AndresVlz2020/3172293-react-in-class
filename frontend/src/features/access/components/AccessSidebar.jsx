// frontend/src/features/access/components/AccessSidebar.jsx

import { useState, useEffect } from "react";
import { Select } from "@/shared";
import { getGroups } from "../services/groupService";
import {
  getGroupPermissions,
  getUserPermissions,
} from "../services/permissionService";

export default function AccessSidebar({
  selectedGroup,
  setSelectedGroup,
  setSelectedGroupName,
  selectedUser,
  setSelectedUser,
  setSelectedUserName,
  setGroupPermissions,
  setPermissionsDraft,
  setIsEditing,
}) {
  // Estado de los grupos
  const [groups, setGroups] = useState([]);

  // Estado de los usuarios reales activos desde el backend
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getGroups().then(setGroups).catch(console.error);

    fetch("http://localhost:4000/api/users?active=true", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Validar que solo se muestren usuarios activos (habilitados)
          const activeUsers = data.filter((user) =>
            Boolean(user.isActive ?? user.is_active),
          );
          setUsers(activeUsers);
        }
      })
      .catch(console.error);
  }, []);

  const groupOptions = groups.map((group) => ({
    value: String(group.group_id),
    label: group.group_name,
  }));

  const userOptions = users
    .filter((user) => Boolean(user.isActive ?? user.is_active))
    .map((user) => ({
      value: String(user.id),
      label: user.name || user.user_name,
    }));

  return (
    <aside className="w-[350px] space-y-12">
      <section>
        <h2 className="text-lg font-semibold mb-6">Grupos usuarios</h2>

        <Select
          name="groupId"
          value={selectedGroup}
          onChange={async (e) => {
            const groupId = e.target.value;

            const selectedGroupData = groups.find(
              (group) => String(group.group_id) === groupId,
            );

            setSelectedGroup(groupId);
            setSelectedGroupName?.(selectedGroupData?.group_name ?? "");

            setSelectedUser?.("");
            setSelectedUserName?.("");
            setIsEditing?.(false);

            if (!groupId) {
              setGroupPermissions([]);
              setPermissionsDraft?.([]);
              return;
            }

            const permissions = await getGroupPermissions(groupId);
            console.log("PERMISOS DEL GRUPO:", permissions);

            setGroupPermissions(permissions);
            setPermissionsDraft?.(permissions);
          }}
          options={groupOptions}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-6">Usuario individual</h2>

        <Select
          name="userId"
          value={selectedUser}
          onChange={async (e) => {
            const userId = e.target.value;

            const selectedUserData = users.find(
              (user) => String(user.id) === userId,
            );

            setSelectedUser?.(userId);
            setSelectedUserName?.(
              selectedUserData?.name || selectedUserData?.user_name || "",
            );

            setSelectedGroup("");
            setSelectedGroupName?.("");
            setIsEditing?.(false);

            if (!userId) {
              setGroupPermissions([]);
              setPermissionsDraft?.([]);
              return;
            }

            const permissions = await getUserPermissions(userId);
            console.log("PERMISOS DEL USUARIO:", permissions);

            setGroupPermissions(permissions);
            setPermissionsDraft?.(permissions);
          }}
          options={userOptions}
        />
      </section>
    </aside>
  );
}
