import express from "express";
import upload from "../../middleware/upload.js";
import { uploadImage } from "../profile/upload.controller.js";

const router = express.Router();

router.post("/upload-image", upload.single("image"), uploadImage);

export default router;
