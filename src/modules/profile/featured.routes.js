import express from "express";
import { getFeaturedProfiles, markFeatured, unmarkFeatured } from "./featured.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",protect, getFeaturedProfiles);        // public: list featured
router.post("/mark",  markFeatured);    // admin: body { profileId }
router.post("/unmark", unmarkFeatured);

export default router;
