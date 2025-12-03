import express from "express";
import {
  createProfile,
  updateProfile,
  getProfile,
  searchProfiles,
  getAllProfiles,
  getProfileById,
  updateProfileScore,
  getFilterOptions,
  getOwnProfileById
} from "./profile.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createProfile);
router.put("/update", protect, updateProfile);
router.get("/me", protect, getProfile);
router.get("/search", protect, searchProfiles);
router.get("/profiles", getAllProfiles);
router.get("/filters", getFilterOptions);
router.get("/:id", getProfileById);
router.get("/own-profile/:id", getOwnProfileById);
router.put("/update-score", protect, updateProfileScore);



export default router;
