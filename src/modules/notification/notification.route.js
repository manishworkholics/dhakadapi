import express from "express";
import { getMyNotifications } from "./notification.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);        // public: list featured


export default router;
