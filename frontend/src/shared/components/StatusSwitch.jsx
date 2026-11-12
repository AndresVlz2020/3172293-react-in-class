// Iconos usados dentro del switch
import { Check, X } from "lucide-react";

/**
 * Componente controlado para representar un switch de estado (habilitado / inhabilitado).
 * El switch no muta su estado hasta que la acción es confirmada mediante SweetAlert.
 */
export default function StatusSwitch({
  checked = false,   // Valor controlado desde el registro en PostgreSQL
  onChange,          // Callback para solicitar la confirmación de cambio con SweetAlert
  disabled = false,  // Permite deshabilitar la interacción
  size = "md",       // Tamaño del switch (sm, md, lg)
}) {
  const isChecked = Boolean(checked);

  // Manejador del click en el switch
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    if (onChange) {
      onChange(!isChecked);
    }
  };

  // Clases de tamaño del contenedor del switch
  const sizes = {
    sm: "h-5 w-9",
    md: "h-6 w-11",
    lg: "h-7 w-14",
  };

  // Clases de tamaño del "knob" (el círculo que se mueve)
  const knobSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={isChecked ? "Habilitado / Activo" : "Inhabilitado / Inactivo"}
      onClick={handleToggle}
      disabled={disabled}
      className={`
        relative inline-flex items-center rounded-full transition-colors cursor-pointer
        ${sizes[size]}
        ${isChecked ? "bg-green-600" : "bg-gray-400"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span
        className={`
          absolute left-0.5 flex items-center justify-center rounded-full bg-white shadow transition-transform duration-200
          ${knobSizes[size]}
          ${isChecked ? "translate-x-full" : "translate-x-0"}
        `}
      >
        {isChecked ? (
          <Check size={12} className="text-green-600" />
        ) : (
          <X size={12} className="text-gray-500" />
        )}
      </span>
    </button>
  );
}
