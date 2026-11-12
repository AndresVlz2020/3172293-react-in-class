import Swal from "sweetalert2";

export function showSuccessAlert({
  title = "Éxito",
  text = "",
  confirmButtonText = "Aceptar",
  timer = 3000,
} = {}) {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText,
    timer,
    timerProgressBar: true,
    customClass: {
      popup: "rounded-2xl",
      title: "text-green-600 font-bold",
      confirmButton: "bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer",
    },
    buttonsStyling: false,
  });
}

export function showErrorAlert({
  title = "Error",
  text = "Ocurrió un error al procesar la solicitud.",
  confirmButtonText = "Entendido",
} = {}) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText,
    customClass: {
      popup: "rounded-2xl",
      title: "text-red-600 font-bold",
      confirmButton: "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer",
    },
    buttonsStyling: false,
  });
}

export function showWarningAlert({
  title = "Atención",
  text = "",
  confirmButtonText = "Aceptar",
} = {}) {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText,
    customClass: {
      popup: "rounded-2xl",
      title: "text-amber-600 font-bold",
      confirmButton: "bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer",
    },
    buttonsStyling: false,
  });
}

export function showConfirmAlert({
  title = "¿Está seguro?",
  text = "Esta acción modificará el estado del registro.",
  confirmButtonText = "Sí, confirmar",
  cancelButtonText = "Cancelar",
  isDestructive = false,
} = {}) {
  return Swal.fire({
    title,
    text,
    icon: isDestructive ? "warning" : "question",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: "rounded-2xl shadow-xl",
      title: "font-bold text-gray-800",
      htmlContainer: "text-gray-600 text-sm",
      confirmButton: `${
        isDestructive
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-green-600 hover:bg-green-700 text-white"
      } font-semibold px-4 py-2 rounded-lg cursor-pointer ml-3`,
      cancelButtonText: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg cursor-pointer",
    },
    buttonsStyling: false,
  });
}

export default {
  showSuccessAlert,
  showErrorAlert,
  showWarningAlert,
  showConfirmAlert,
};
