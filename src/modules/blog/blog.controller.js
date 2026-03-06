import Blog from "./blog.model.js";
import slugify from "slugify";


// ================= CREATE BLOG =================

export const createBlog = async (req, res) => {
    try {

        const { title, excerpt, content, image, tags, seoTitle, seoDescription, status } = req.body

        const slug = slugify(title, { lower: true })

        const blog = await Blog.create({
            title,
            slug,
            excerpt,
            content,
            image,
            tags,
            seoTitle,
            seoDescription,
            status,
            publishedAt: status === "published" ? new Date() : null
        })

        res.status(201).json({
            success: true,
            blog
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


// ================= GET ALL BLOGS =================

export const getBlogs = async (req, res) => {
    try {

        const blogs = await Blog.find()
            .sort({ createdAt: -1 })

        res.json({
            success: true,
            blogs
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


// ================= GET BLOG BY SLUG =================

export const getBlogBySlug = async (req, res) => {
    try {

        const blog = await Blog.findOne({
            slug: req.params.slug,
            status: "published"
        })

        res.json({
            success: true,
            blog
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


// ================= UPDATE BLOG =================

export const updateBlog = async (req, res) => {
    try {

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.json({
            success: true,
            blog
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


// ================= DELETE BLOG =================

export const deleteBlog = async (req, res) => {
    try {

        await Blog.findByIdAndDelete(req.params.id)

        res.json({
            success: true,
            message: "Blog deleted"
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}