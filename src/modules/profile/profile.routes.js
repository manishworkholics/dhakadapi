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
  getOwnProfileById,
  getRelatedProfiles
} from "./profile.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/related", protect, getRelatedProfiles);
router.post("/create", protect, createProfile);
router.put("/update", protect, updateProfile);
router.get("/me", protect, getProfile);
router.get("/search", protect, searchProfiles);
router.get("/profiles",protect, getAllProfiles);
router.get("/filters", getFilterOptions);
router.get("/:id", protect, getProfileById);
router.get("/own-profile/:id", protect, getOwnProfileById);
router.put("/update-score", protect, updateProfileScore);



export default router;
