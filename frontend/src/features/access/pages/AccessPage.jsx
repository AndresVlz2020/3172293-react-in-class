// frontend/src/features/access/pages/AccessPage.jsx
// Corrección: el estado de edición pasa a AccessPage

import { useEffect, useState } from "react";
import AccessSidebar from "../components/AccessSidebar";
import PermissionModule from "../components/PermissionModule";
import { updateGroupPermissions } from "../services/groupService";
import {
  getAllPermissions,
  updateUserPermissions,
} from "../services/permissionService";

export default function AccessPage() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [groupPermissions, setGroupPermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [permissionsDraft, setPermissionsDraft] = useState([]);

  useEffect(() => {
    getAllPermissions().then(setAllPermissions).catch(console.error);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setPermissionsDraft(groupPermissions);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const permissionIds = permissionsDraft
      .map((permission) => permission.permission_id)
      .filter(Boolean);

    if (selectedGroup) {
      await updateGroupPermissions(selectedGroup, permissionIds);
    } else if (selectedUser) {
      await updateUserPermissions(selectedUser, permissionIds);
    }

    setGroupPermissions(permissionsDraft);

    setIsEditing(false);
  };

  return (
    <div className="p-6 flex gap-10">
      <AccessSidebar
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        setSelectedGroupName={setSelectedGroupName}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setSelectedUserName={setSelectedUserName}
        groupPermissions={groupPermissions}
        setGroupPermissions={setGroupPermissions}
        setPermissionsDraft={setPermissionsDraft}
        setIsEditing={setIsEditing}
      />

      <div className="flex-1">
        <h1 className="text-xl font-semibold mb-6">Gestión de permisos</h1>

        <PermissionModule
          selectedGroup={selectedGroup}
          selectedGroupName={selectedGroupName}
          selectedUser={selectedUser}
          selectedUserName={selectedUserName}
          isEditing={isEditing}
          allPermissions={allPermissions}
          permissionsDraft={permissionsDraft}
          setPermissionsDraft={setPermissionsDraft}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
