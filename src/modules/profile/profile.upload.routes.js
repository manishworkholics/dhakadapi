import express from "express";
import { upload } from "../../utils/uploadHelper.js";
import { protect } from "../../middleware/authMiddleware.js";
import {
  uploadProfilePhoto,
  uploadIntroVideo
 
} from "./profile.upload.controller.js";

const router = express.Router();

router.post("/photo", protect, upload.single("photo"), uploadProfilePhoto);
router.post("/video", protect, upload.single("video"), uploadIntroVideo);

export default router;
