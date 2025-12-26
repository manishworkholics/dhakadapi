import express from "express";
import { getPlans, buyPlan, getMyPlan, createPlan, createOrder, verifyPayment, getPaymentHistory, getAllPaymentHistory, deletePlan, updatePlan } from "../plan/plan.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { adminProtect } from "../../middleware/adminMiddleware.js";

const router = express.Router();


router.post("/buy", protect, buyPlan);
router.get("/my-plan", protect, getMyPlan);

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/history", protect, getPaymentHistory);
router.get("/get-all-payment-history", adminProtect, getAllPaymentHistory);

// routes/admin.routes.js
router.get("/", getPlans);
router.post("/plans", adminProtect, createPlan);
router.put("/plans/:id", adminProtect, updatePlan);
router.delete("/plans/:id", adminProtect, deletePlan);


export default router;
