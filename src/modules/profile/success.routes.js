import express from "express";
import { createStory, getStories, getStoryById, deleteStory } from "./success.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createStory);     // create (admin or trusted user)
router.get("/", getStories);             // list
router.get("/:id", getStoryById);        // get by id
router.delete("/:id", protect, deleteStory);// delete (admin)

export default router;
