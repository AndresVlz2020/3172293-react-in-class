// Fuente de datos de usuarios: API real (PostgreSQL vía backend)
import { getUsers } from "../../services/userServices";

// Utilidad para transformar datos en dataset de reporte
import { buildReportDataset } from "../utils/buildReportDataset";

// Servicios de exportación
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

// Alertas reutilizables del design system
import { showErrorAlert } from "@/shared";

// Caso de uso: orquestador de generación de reportes de usuarios
// Patrón: Application Service (coordina utilidades y servicios)
export async function generateUserReport({
  format,        // "excel" o "pdf"
  selectedFields,// Campos seleccionados por el usuario
  scope,         // Alcance del reporte
  documentNumber // Filtro opcional
}) {

  // Validación: debe haber al menos un campo seleccionado
  if (!selectedFields?.length) {
    await showErrorAlert({
      title: "Sin campos",
      text: "Selecciona al menos un campo para generar el reporte.",
    });
    return;
  }

  // Consulta los usuarios reales desde la base de datos (a través de la API)
  let users;
  try {
    users = await getUsers();
  } catch (error) {
    await showErrorAlert({
      title: "Error al consultar los usuarios",
      text: error.message || "No se pudieron cargar los usuarios desde el servidor.",
    });
    return;
  }

  // Construcción del dataset (desacoplado de la UI)
  const { headers, rows } = buildReportDataset({
    users,
    selectedFields,
    scope,
    documentNumber
  });

  // Validación: evita generar archivos vacíos
  if (!rows.length) {
    await showErrorAlert({
      title: "Sin datos",
      text: "No hay usuarios en la base de datos para el alcance seleccionado.",
    });
    return;
  }

  // Generación de timestamp para nombres únicos de archivo (YYYY-MM-DD)
  const timestamp = new Date().toISOString().split("T")[0];

  // Selección de estrategia de exportación según formato
  if (format === "excel") {
    generateExcelReport({
      headers,
      rows,
      fileName: `users-report-${timestamp}.xlsx`
    });
  }

  if (format === "pdf") {
    generatePdfReport({
      headers,
      rows,
      fileName: `users-report-${timestamp}.pdf`
    });
  }
}
