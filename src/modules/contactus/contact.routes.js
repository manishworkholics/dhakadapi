import express from "express";

import { adminProtect } from "../../middleware/adminMiddleware.js"; // only admin should access list
import { submitContact, getAllContact } from "./contact.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitContact);       // public
router.get("/", adminProtect, getAllContact); // admin view contacts

export default router;
