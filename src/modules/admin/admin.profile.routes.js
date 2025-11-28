import express from "express";
import {
  getPendingProfiles,
  approveProfile,
  rejectProfile,
  getAllProfilesAdmin,
  getProfileDetailAdmin
} from "./admin.profile.controller.js";
import { adminProtect } from "../../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/profiles/pending", adminProtect, getPendingProfiles);
router.put("/profiles/:id/approve", adminProtect, approveProfile);
router.put("/profiles/:id/reject", adminProtect, rejectProfile);

router.get("/profiles",adminProtect, getAllProfilesAdmin);
router.get("/profiles/:id",adminProtect, getProfileDetailAdmin);

export default router;
