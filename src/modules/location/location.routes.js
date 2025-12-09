import express from "express";
import { addLocation, getStates, getCitiesByState } from "./location.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();


router.post("/add", addLocation);              
router.get("/states", getStates);             
router.get("/cities/:state", getCitiesByState);

export default router;