import { createPortal } from "react-dom";
import { X, User, Mail, Phone, FileText, ShieldCheck, Calendar } from "lucide-react";
import { Button } from "@/shared";

export default function UserViewModal({ isOpen, onClose, user }) {
    if (!isOpen || !user) return null;

    const isActive = Boolean(user.isActive ?? user.is_active ?? true);
    const isSuperUser = Boolean(user.isSuperUser ?? user.is_superuser);
    const isStaff = Boolean(user.isStaff ?? user.is_staff);
    const formattedDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "No disponible";

    return createPortal(
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[var(--color-primary-950)]/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-[26px] border border-[var(--semantic-border)] bg-[var(--semantic-background)] px-6 py-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera del modal usando variables semánticas y tokens */}
                <div className="flex items-center justify-between border-b border-[var(--semantic-border)] pb-4 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--semantic-brand)]">
                            <User size={22} />
                        </div>
                        <div>
                            <h2 className="text-[length:var(--semantic-font-size-h3)] font-[var(--fw-bold)] text-[var(--semantic-text-primary)]">
                                {user.name || user.user_name || "Detalle del usuario"}
                            </h2>
                            <span className="text-[length:var(--semantic-font-size-small)] text-[var(--semantic-text-muted)]">
                                ID de usuario: #{user.id}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-[var(--semantic-text-muted)] hover:bg-[var(--color-gray-100)] hover:text-[var(--semantic-text-primary)] transition-colors cursor-pointer"
                        aria-label="Cerrar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Cuerpo con la información del usuario usando tokens y variables semánticas */}
                <div className="space-y-3 text-[length:var(--semantic-font-size-medium)]">
                    <div className="flex items-center justify-between rounded-lg border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-3 py-2.5">
                        <span className="flex items-center gap-2 text-[var(--semantic-text-secondary)]">
                            <Mail size={16} className="text-[var(--color-primary-500)]" />
                            Correo electrónico
                        </span>
                        <span className="font-[var(--fw-medium)] text-[var(--semantic-text-primary)]">
                            {user.email || user.user_email || "No registrado"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-3 py-2.5">
                        <span className="flex items-center gap-2 text-[var(--semantic-text-secondary)]">
                            <Phone size={16} className="text-[var(--color-primary-500)]" />
                            Teléfono
                        </span>
                        <span className="font-[var(--fw-medium)] text-[var(--semantic-text-primary)]">
                            {user.phone || user.user_phone || "No registrado"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-3 py-2.5">
                        <span className="flex items-center gap-2 text-[var(--semantic-text-secondary)]">
                            <FileText size={16} className="text-[var(--color-primary-500)]" />
                            Documento
                        </span>
                        <span className="font-[var(--fw-medium)] text-[var(--semantic-text-primary)]">
                            {user.document_type || user.user_document_types
                                ? `${user.document_type || user.user_document_types} - `
                                : ""}
                            {user.document_number || user.user_document_number || "No registrado"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-3 py-2.5">
                        <span className="flex items-center gap-2 text-[var(--semantic-text-secondary)]">
                            <ShieldCheck size={16} className="text-[var(--color-primary-500)]" />
                            Rol / Permisos base
                        </span>
                        <div className="flex items-center gap-1.5">
                            {isSuperUser && (
                                <span className="rounded-full bg-[var(--color-primary-100)] px-2.5 py-0.5 text-[length:var(--semantic-font-size-small)] font-[var(--fw-medium)] text-[var(--color-primary-800)]">
                                    Superusuario
                                </span>
                            )}
                            {isStaff && (
                                <span className="rounded-full bg-[var(--color-secondary-100)] px-2.5 py-0.5 text-[length:var(--semantic-font-size-small)] font-[var(--fw-medium)] text-[var(--color-secondary-800)]">
                                    Staff
                                </span>
                            )}
                            {!isSuperUser && !isStaff && (
                                <span className="rounded-full bg-[var(--color-gray-200)] px-2.5 py-0.5 text-[length:var(--semantic-font-size-small)] font-[var(--fw-medium)] text-[var(--semantic-text-secondary)]">
                                    Estándar
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-3 py-2.5">
                        <span className="text-[var(--semantic-text-secondary)]">
                            Estado en el sistema
                        </span>
                        <span
                            className={`rounded-full px-2.5 py-0.5 text-[length:var(--semantic-font-size-small)] font-[var(--fw-medium)] ${
                                isActive
                                    ? "bg-[var(--color-primary-50)] text-[var(--semantic-success)]"
                                    : "bg-[var(--color-secondary-50)] text-[var(--semantic-error)]"
                            }`}
                        >
                            {isActive ? "Activo" : "Inactivo"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-3 py-2.5">
                        <span className="flex items-center gap-2 text-[var(--semantic-text-secondary)]">
                            <Calendar size={16} className="text-[var(--color-primary-500)]" />
                            Fecha de registro
                        </span>
                        <span className="font-[var(--fw-medium)] text-[var(--semantic-text-primary)]">
                            {formattedDate}
                        </span>
                    </div>
                </div>

                {/* Pie del modal */}
                <div className="mt-6 flex justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
