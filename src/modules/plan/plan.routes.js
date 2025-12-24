import express from "express";
import { getPlans, buyPlan, getMyPlan ,createPlan,createOrder,verifyPayment} from "../plan/plan.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPlans);
router.post("/buy", protect, buyPlan);
router.get("/my-plan", protect, getMyPlan);

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

// routes/admin.routes.js

router.post("/plans", createPlan);


export default router;
