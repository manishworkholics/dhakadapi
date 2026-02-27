import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { checkPremiumPlan } from "../../middleware/checkPremiumPlan.js";
import { adminProtect } from "../../middleware/adminMiddleware.js";

import {
    createReview,
    getApprovedReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    getPendingReviews,
    updateReviewStatus,
    getPublicTestimonials
} from "./review.controller.js";

const router = express.Router();

/* ===============================
   USER ROUTES
================================ */

// Create Review (Premium required if needed)
router.post("/", protect, checkPremiumPlan, createReview);

// Get My Reviews
router.get("/my", protect, getMyReviews);

// Update Review
router.put("/:id", protect, updateReview);

// Delete Review
router.delete("/:id", protect, deleteReview);

/* ===============================
   PUBLIC ROUTE
================================ */

// Get Approved Reviews by targetId
router.get("/approved/:targetId", getApprovedReviews);

router.get("/testimonials", getPublicTestimonials);

/* ===============================
   ADMIN ROUTES
================================ */

// Get All Pending Reviews
router.get("/admin/pending", adminProtect, getPendingReviews);

// Approve / Reject Review
router.patch("/admin/status/:id", adminProtect, updateReviewStatus);

export default router;