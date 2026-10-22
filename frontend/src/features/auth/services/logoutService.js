// frontend/src/features/auth/services/logoutService.js
// Cerrar sesión eliminando JWT

export function logout() {
    sessionStorage.removeItem("token");
}