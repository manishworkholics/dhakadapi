import express from "express";
import { savePartnerPreference, getMyPartnerPreference, deletePartnerPreference, } from "./partnerPreference.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/save", protect, savePartnerPreference);
router.get("/my", protect, getMyPartnerPreference);
router.delete("/delete", protect, deletePartnerPreference);

export default router;
