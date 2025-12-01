import express from "express";
import { sendOtp, verifyOtp, registerUser, emailLogin,resendOtp } from "./auth.controller.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerUser);
router.post("/email-login", emailLogin);
router.post("/resend-otp", resendOtp);

export default router;
