import express from "express";
import { getFeaturedProfiles, markFeatured, unmarkFeatured } from "./featured.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFeaturedProfiles);        // public: list featured
router.post("/mark", protect, markFeatured);    // admin: body { profileId }
router.post("/unmark", protect, unmarkFeatured);

export default router;
