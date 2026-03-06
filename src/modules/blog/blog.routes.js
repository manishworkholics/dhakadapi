import express from "express";
import {
    createBlog,
    getBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog
} from "./blog.controller.js";

const router = express.Router();

router.post("/", createBlog)

router.get("/", getBlogs)

router.get("/:slug", getBlogBySlug)

router.put("/:id", updateBlog)

router.delete("/:id", deleteBlog)

export default router