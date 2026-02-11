// routes/match.routes.js
import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { getMatches, getSingleMatchProfile } from "./match.controller.js";

const router = express.Router();

router.get("/new-matches", protect, getMatches);
router.get("/matches/profile/:id", protect, getSingleMatchProfile);




export default router;
