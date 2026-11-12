import { useState } from "react";
// Iconos usados en los botones de acciones
import { Eye, Pencil } from "lucide-react";

// Hook de react router para navegar programáticamente entre rutas
import { useNavigate } from "react-router-dom";
import UserViewModal from "./UserViewModal";

// Componente que renderiza las acciones de cada fila de usuario
// Recibe como prop el objeto user
export default function UserRowActions({ user }) {
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Hook que permite redirigir a otra ruta desde código
    const navigate = useNavigate();

    // Acción para visualizar la información del usuario
    const handleView = () => {
        setIsViewOpen(true);
    };

    // Acción para editar el usuario
    // Redirige a la página de edición usando el id del usuario
    const handleEdit = () => {
        navigate(`/dashboard/users/${user.id}/edit`);
    };

    return (
        <>
            {/* Contenedor de botones de acciones aplicando las variables del sistema */}
            <div className="flex items-center gap-2">
                {/* Botón de visualización (ojo) */}
                <button
                    type="button"
                    onClick={handleView}
                    title="Visualizar usuario"
                    className="p-1.5 rounded-md border border-[var(--semantic-border)] bg-[var(--color-primary-50)] text-[var(--semantic-brand)] hover:bg-[var(--semantic-brand-soft)] hover:text-[var(--semantic-brand-hover)] transition-colors cursor-pointer"
                >
                    <Eye size={16} />
                </button>

                {/* Botón de edición (lápiz) */}
                <button
                    type="button"
                    onClick={handleEdit}
                    title="Editar usuario"
                    className="p-1.5 rounded-md bg-[var(--semantic-brand)] text-[var(--semantic-text-inverse)] hover:bg-[var(--semantic-brand-hover)] transition-colors cursor-pointer"
                >
                    <Pencil size={16} />
                </button>
            </div>

            {/* Modal para visualizar el detalle completo del usuario */}
            <UserViewModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                user={user}
            />
        </>
    );
}
