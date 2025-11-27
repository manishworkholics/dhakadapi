import express from "express";
import {
  sendInterest,
  getMyInterests,
  cancelInterest,
  checkInterest,
} from "./interest.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendInterest);         // body: { receiverId }
router.get("/my", protect, getMyInterests);          // my sent interests
router.delete("/:id", protect, cancelInterest);      // cancel by interest id
router.get("/check", protect, checkInterest);        // ?receiverId=xxx

export default router;
