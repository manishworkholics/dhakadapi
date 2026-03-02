import express from "express";
import { getDashboardSummary } from "./admin.dashboard.controller.js";
import { adminProtect } from "../../middleware/adminMiddleware.js";
import { authorizePermission } from "../../middleware/permissionMiddleware.js";

const router = express.Router();

router.get(
    "/dashboard",
    adminProtect,
    authorizePermission("view_dashboard"),
    getDashboardSummary
);

export default router;
