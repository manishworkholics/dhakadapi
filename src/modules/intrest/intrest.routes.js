import express from "express";
import { sendInterestRequest, getReceivedRequests, getSentRequests, acceptRequest, rejectRequest, cancelRequest } from "./intrest.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { checkPremiumPlan } from "../../middleware/checkPremiumPlan.js";

const router = express.Router();

// public: list featured
router.post("/request/send", protect, checkPremiumPlan, sendInterestRequest);
router.get("/request/received", protect, getReceivedRequests);
router.get("/request/sent", protect, getSentRequests);
router.put("/request/accept/:id", protect, acceptRequest);
router.put("/request/reject/:id", protect, rejectRequest);
router.delete("/request/cancel/:id", protect, cancelRequest);

export default router;