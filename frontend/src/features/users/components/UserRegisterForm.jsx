// Wrapper de compatibilidad: el registro de usuarios usa el formulario compartido
import UserForm from "./UserForm";

export default function UserRegisterForm() {
  return <UserForm mode="create" />;
}
