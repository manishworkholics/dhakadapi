import express from "express";
import { sendOtp, verifyOtp, registerUser, emailLogin, } from "./auth.controller.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerUser);
router.post("/email-login", emailLogin);

export default router;
