import express from "express";
import { registerAdmin, adminLogin, getAdminProfile,getAdminDashboard } from "./admin.controller.js";
import { adminProtect } from "../../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", adminLogin);
router.get("/me", adminProtect, getAdminProfile);
router.get("/dashboard",  getAdminDashboard);

export default router;
