// Componente compartido para registrar y editar usuarios
// mode="create" -> crea un usuario nuevo
// mode="edit"   -> actualiza un usuario existente (initialUser)
import { useState, useEffect } from "react";
import {
  Input,
  Select,
  Checkbox,
  Button,
  IconButton,
  FileInput,
} from "@/shared";
import { getDocumentTypes } from "../../../services/selectServices";
import { useNavigate } from "react-router-dom";
import { userSchema, userEditSchema } from "../schemas/userSchema";
import { createUser, updateUser } from "../services/userServices";
import { ArrowLeft } from "lucide-react";
import { showSuccessAlert } from "@/shared/services/alertService";

export default function UserForm({ mode = "create", initialUser = null }) {
  const isEdit = mode === "edit";

  // Estado de envío
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navegación
  const navigate = useNavigate();

  // Estado del error
  const [errors, setErrors] = useState({});

  // Estados del formulario: en edición se precargan con el usuario recibido
  const [formData, setFormData] = useState(() => ({
    userName: initialUser?.name ?? "",
    userEmail: initialUser?.email ?? "",
    userPhone: initialUser?.phone ?? "",
    userDocumentType: initialUser?.document_type ?? "",
    userDocumentNumber: initialUser?.document_number ?? "",
    userPassword: "",
    userImage: [],
    isStaff: Boolean(initialUser?.isStaff),
    isActive: initialUser?.isActive ?? true,
    isSuperUser: Boolean(initialUser?.isSuperUser),
  }));

  // Handle genérico
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar el error del campo si existe
    setErrors((prevErrors) => {
      if (!prevErrors[name]) return prevErrors;

      const nextErrors = { ...prevErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const schema = isEdit ? userEditSchema : userSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Payload con los nombres que espera el backend
    const payload = {
      ...result.data,
      userDocumentTypes: result.data.userDocumentType,
      isSuperuser: result.data.isSuperUser,
    };

    // En edición, una contraseña vacía significa "mantener la actual"
    if (isEdit && !payload.userPassword) {
      delete payload.userPassword;
    }

    try {
      if (isEdit) {
        await updateUser(initialUser.id, payload);
      } else {
        await createUser(payload);
      }

      await showSuccessAlert({
        text: isEdit
          ? "El usuario ha sido actualizado exitosamente."
          : "El usuario ha sido registrado exitosamente.",
      });

      if (isEdit) {
        navigate("/dashboard/userList");
      } else {
        navigate(-1);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [documentTypes, setDocumentTypes] = useState([]);
  useEffect(() => {
    getDocumentTypes().then(setDocumentTypes);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <h1 className="mb-8 text-2xl font-bold text-[var(--semantic-text-primary)]">
        {isEdit ? "Editar usuario" : "Registro de usuarios"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-80 flex flex-col gap-3"
      >
        <Input
          label="Nombre"
          name="userName"
          type="text"
          value={formData.userName}
          placeholder="Escribe tu nombre"
          htmlFor="user-name"
          onChange={handleChange}
          error={errors.userName}
        />

        <Input
          label="Correo"
          name="userEmail"
          type="email"
          value={formData.userEmail}
          placeholder="Escribe tu correo"
          htmlFor="user-email"
          onChange={handleChange}
          error={errors.userEmail}
        />

        <Input
          label="Teléfono"
          name="userPhone"
          type="tel"
          value={formData.userPhone}
          placeholder="Escribe tu teléfono"
          htmlFor="user-phone"
          onChange={handleChange}
          error={errors.userPhone}
        />

        <Select
          label="Tipos de documentos"
          name="userDocumentType"
          htmlFor="userDocumentTypes"
          options={documentTypes}
          value={formData.userDocumentType}
          onChange={handleChange}
          error={errors.userDocumentType}
        />

        <Input
          label="Documento"
          name="userDocumentNumber"
          type="text"
          value={formData.userDocumentNumber}
          placeholder="Escribe tu número de documento"
          htmlFor="user-document-number"
          onChange={handleChange}
          error={errors.userDocumentNumber}
        />

        <Input
          label={isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}
          name="userPassword"
          type="password"
          value={formData.userPassword}
          placeholder={
            isEdit
              ? "Dejar vacío para mantener la actual"
              : "Escribe tu contraseña"
          }
          htmlFor="user-password"
          onChange={handleChange}
          error={errors.userPassword}
        />

        <FileInput
          value={formData.userImage}
          onChange={(files) =>
            setFormData((prev) => ({ ...prev, userImage: files }))
          }
          multiple={true}
        />
        {errors.userImage && (
          <span className="text-red-500 text-sm">{errors.userImage}</span>
        )}

        {/* Checkboxes */}
        <div className="grid gap-3 my-2">
          <Checkbox
            id="isSuperUser"
            name="isSuperUser"
            label="Es super usuario"
            checked={formData.isSuperUser}
            onChange={handleChange}
          />

          <Checkbox
            id="isStaff"
            name="isStaff"
            label="Es staff"
            checked={formData.isStaff}
            onChange={handleChange}
          />

          <Checkbox
            id="isActive"
            name="isActive"
            label="Está activo"
            checked={formData.isActive}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => navigate("/dashboard/userList")}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>

          <IconButton
            ariaLabel="Volver"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
          </IconButton>
        </div>
      </form>
    </div>
  );
}
