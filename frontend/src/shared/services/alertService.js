import Swal from "sweetalert2";

export function showSuccessAlert({
    // Los valores después del = son valores por defecto
    title = "Éxito",
    text = "",
    confirmButtonText = "Aceptar",
    timer = 3000,
}) {
    // Swal.fire() crea el modal.
    return Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonText,
        timer,
        timerProgressBar: true,

        customClass:{
            popup:"rounded-2xl",
            title:"text green-600",
            confirmButton:"bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg",

        },

        buttonsStyling: false,
        
    });
}