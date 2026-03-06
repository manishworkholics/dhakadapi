import express from "express";
import { registerAdmin, adminLogin, getAdminProfile, getAdminDashboard, getRoles, getAllAdmins, createRole, getAdminLogs, createPermission, getPermissions, deletePermission, updateRolePermissions } from "./admin.controller.js";
import { adminProtect } from "../../middleware/adminMiddleware.js";
import { authorizePermission } from "../../middleware/permissionMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  adminProtect,
  authorizePermission("manage_admins"),
  registerAdmin
);
router.post("/login", adminLogin);
router.get("/me", adminProtect, getAdminProfile);
router.get("/dashboard", getAdminDashboard);

router.get(
  "/logs",
  adminProtect,
  authorizePermission("manage_admins"),
  getAdminLogs
);

router.post(
  "/roles",
  adminProtect,
  authorizePermission("manage_admins"),
  createRole
);

router.get(
  "/roles",
  adminProtect,
  authorizePermission("manage_admins"),
  getRoles
);

router.put("/roles/:id/permissions",
  adminProtect,
  authorizePermission("manage_admins"),
  updateRolePermissions
);

router.get(
  "/list",
  adminProtect,
  authorizePermission("manage_admins"),
  getAllAdmins
);
router.post("/permissions",
  adminProtect,
  authorizePermission("manage_admins"),
  createPermission
);
router.get("/permissions",
  adminProtect,
  authorizePermission("manage_admins"),
  getPermissions
);
router.delete("/permissions/:id",
  adminProtect,
  authorizePermission("manage_admins"),
  deletePermission
);

export default router;
