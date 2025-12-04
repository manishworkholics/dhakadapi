import express from "express";

import {
    markProfileViewed,
    getViewedProfiles,
    getWhoViewedMyProfile
} from "../profile/profileview.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
const router = express.Router();

// ⭐ Mark a profile as viewed
// POST /api/profile/view/:id
router.post("/view/:id", protect, markProfileViewed);

// ⭐ Get profiles viewed by the logged-in user
// GET /api/profile/viewed
router.get("/viewed", protect, getViewedProfiles);

// ⭐ Get users who viewed my profile
// GET /api/profile/viewed-by
router.get("/viewed-by", protect, getWhoViewedMyProfile);

export default router;
