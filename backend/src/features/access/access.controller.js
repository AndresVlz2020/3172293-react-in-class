// backend/src/features/access/access.controller.js
// CORRECCIÓN: obtener usuario desde JWT

import { accessService } from "./access.service.js";

export const accessController = {
  async testPermission(req, res) {
    const userId = req.user.id;

    const permissionCode = req.params.permissionCode;

    const hasPermission = await accessService.hasPermission(
      userId,
      permissionCode,
    );

    res.json({
      userId,
      permission: permissionCode,
      granted: hasPermission,
    });
  },
};
