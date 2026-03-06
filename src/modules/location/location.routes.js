import express from "express";
import {
  addLocation,
  getStates,
  getCitiesByState,
  updateState,
  deleteState,
  addCity,
  updateCity,
  deleteCity
} from "./location.controller.js";

import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Create
router.post("/add",  addLocation);

// Read
router.get("/states", getStates);
router.get("/cities/:state", getCitiesByState);

// Update State
router.put("/state/:id",  updateState);

// Delete State
router.delete("/state/:id",  deleteState);

// City CRUD
router.post("/city/:id", addCity);       // Add city in state
router.put("/city/:id",  updateCity);     // Update city name
router.delete("/city/:id",  deleteCity);  // Delete city

export default router;