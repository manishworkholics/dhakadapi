import express from "express";
import {
  getAllUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
} from "./admin.user.controller.js";
import { adminProtect } from "../../middleware/adminMiddleware.js";
import { authorizePermission } from "../../middleware/permissionMiddleware.js";

const router = express.Router();

router.get(
  "/users",
  adminProtect,
  authorizePermission("manage_users"),
  getAllUsers
);

router.get(
  "/users/:id",
  adminProtect,
  authorizePermission("manage_users"),
  getUserById
);

router.put(
  "/users/:id/block",
  adminProtect,
  authorizePermission("manage_users"),
  toggleBlockUser
);

router.delete(
  "/users/:id",
  adminProtect,
  authorizePermission("manage_users"),
  deleteUser
);

export default router;
