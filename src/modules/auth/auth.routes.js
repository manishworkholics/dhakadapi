import express from "express";
import { sendOtp, verifyOtp, registerUser, emailLogin, resendOtp, verifyEmailOtp, resendEmailOtp, forgotPassword, verifyForgotOtp, resetPassword } from "./auth.controller.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerUser);
router.post("/email-login", emailLogin);
router.post("/resend-otp", resendOtp);


router.post("/verify-email-otp", verifyEmailOtp);
router.post("/resend-email-otp", resendEmailOtp);


router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOtp);
router.post("/reset-password", resetPassword);


export default router;
