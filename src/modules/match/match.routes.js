// routes/match.routes.js
import express from "express";
import auth from "../middlewares/auth.js";
import { getNewMatches, addProfileView, getViewedProfiles } from "./match.controller.js";

const router = express.Router();

router.get("/new-matches", auth, getNewMatches);
router.post("/view/:id", auth, addProfileView);
router.get("/viewed", auth, getViewedProfiles);

export default router;
