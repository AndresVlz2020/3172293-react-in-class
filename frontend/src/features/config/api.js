// API prefix mounted by the backend (for example, http://localhost:4000/api).
export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/+$/, "");