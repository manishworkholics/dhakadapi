// routes/match.routes.js
import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { getMatches } from "./match.controller.js";

const router = express.Router();

router.get("/new-matches", protect, getMatches);



export default router;
