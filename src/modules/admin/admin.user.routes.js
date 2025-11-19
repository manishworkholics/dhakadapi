import express from "express";
import {
  getAllUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
} from "./admin.user.controller.js";
import { adminProtect } from "../../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/users", adminProtect, getAllUsers);
router.get("/users/:id", adminProtect, getUserById);
router.put("/users/:id/block", adminProtect, toggleBlockUser);
router.delete("/users/:id", adminProtect, deleteUser);

export default router;
