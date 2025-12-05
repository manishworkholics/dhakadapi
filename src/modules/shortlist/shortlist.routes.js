import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  addShortlist,
  removeShortlist,
  getShortlistedProfiles
} from "../shortlist/shortlist.controller.js";

const router = express.Router();

router.post("/:profileId", protect, addShortlist);
router.delete("/:profileId", protect, removeShortlist);
router.get("/", protect, getShortlistedProfiles);

export default router;
