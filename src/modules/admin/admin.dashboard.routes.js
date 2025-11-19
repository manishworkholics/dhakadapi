import express from "express";
import { getDashboardSummary } from "./admin.dashboard.controller.js";
import { adminProtect } from "../../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/dashboard", adminProtect, getDashboardSummary);

export default router;
