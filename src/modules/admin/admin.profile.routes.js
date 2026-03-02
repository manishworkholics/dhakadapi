import express from "express";
import {
  getPendingProfiles,
  approveProfile,
  rejectProfile,
  getAllProfilesAdmin,
  getProfileDetailAdmin
} from "./admin.profile.controller.js";
import { adminProtect } from "../../middleware/adminMiddleware.js";
import { authorizePermission } from "../../middleware/permissionMiddleware.js";

const router = express.Router();

router.get(
  "/profiles/pending",
  adminProtect,
  authorizePermission("manage_profiles"),
  getPendingProfiles
);

router.put(
  "/profiles/:id/approve",
  adminProtect,
  authorizePermission("manage_profiles"),
  approveProfile
);

router.put(
  "/profiles/:id/reject",
  adminProtect,
  authorizePermission("manage_profiles"),
  rejectProfile
);

router.get("/profiles",adminProtect, getAllProfilesAdmin);
router.get("/profiles/:id",adminProtect, getProfileDetailAdmin);

export default router;
