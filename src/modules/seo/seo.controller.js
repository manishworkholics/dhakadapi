import Seo from "./seo.model.js";


// ================= CREATE SEO =================

export const createSeo = async (req, res) => {
    try {

        const {
            page,
            title,
            description,
            keywords,
            ogTitle,
            ogDescription,
            ogImage,
            canonicalUrl
        } = req.body

        const seo = await Seo.create({
            page,
            title,
            description,
            keywords,
            ogTitle,
            ogDescription,
            ogImage,
            canonicalUrl,
            updatedBy: req.admin._id
        })

        res.json({
            success: true,
            seo
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ================= GET ALL =================

export const getAllSeo = async (req, res) => {
    try {

        const seo = await Seo.find().sort({ createdAt: -1 })

        res.json({
            success: true,
            seo
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


// ================= GET BY PAGE =================

export const getSeoByPage = async (req, res) => {
    try {

        const seo = await Seo.findOne({
            page: req.params.page
        })

        res.json({
            success: true,
            seo
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


// ================= UPDATE =================

export const updateSeo = async (req, res) => {
    try {

        const seo = await Seo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.json({
            success: true,
            seo
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


// ================= DELETE =================

export const deleteSeo = async (req, res) => {
    try {

        await Seo.findByIdAndDelete(req.params.id)

        res.json({
            success: true,
            message: "SEO deleted"
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}