// Página de edición de un usuario existente
// Carga el usuario desde la API y lo pasa al formulario compartido
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../services/userServices";
import UserForm from "../components/UserForm";
import { Button } from "@/shared";

export default function UserEditPage() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getUserById(id)
      .then((data) => {
        if (!active) return;
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "No se pudo cargar el usuario");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Cargando usuario...</div>;
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center gap-4">
        <p className="text-red-600">{error}</p>
        <Link to="/dashboard/userList">
          <Button variant="secondary">Volver al listado</Button>
        </Link>
      </div>
    );
  }

  return <UserForm mode="edit" initialUser={user} />;
}
