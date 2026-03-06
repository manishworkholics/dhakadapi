import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true
        },

        excerpt: {
            type: String
        },

        content: {
            type: String,
            required: true
        },

        image: {
            type: String
        },

        tags: [
            {
                type: String
            }
        ],

        author: {
            type: String,
            default: "Admin"
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft"
        },

        seoTitle: String,
        seoDescription: String,

        publishedAt: Date

    },
    { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);