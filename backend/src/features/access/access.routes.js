// backend/src/features/access/access.routes.js
// CORRECCIÓN: proteger la ruta con JWT - permiso dinámico obtenido por codename

import { Router } from "express";
import { accessController } from "./access.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/check/:permissionCode",
  authenticateToken,
  accessController.testPermission,
);

export default router;
