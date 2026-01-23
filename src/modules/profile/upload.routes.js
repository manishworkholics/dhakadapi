import express from "express";
import upload from "../../middleware/upload.js";
import { uploadImage, deleteImage, checkImage } from "../profile/upload.controller.js";

const router = express.Router();

router.post("/upload-image", upload.single("image"), uploadImage);
router.post("/delete-image", deleteImage);
router.get("/check-image", checkImage);


export default router;
