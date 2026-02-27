import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        targetId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          // Ye productId / serviceId / profileId ho sakta hai
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        title: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        isApproved: {
            type: Boolean,
            default: false, // agar admin approval system chahiye ho to false kar sakte ho
        },
    },
    {
        timestamps: true,
    }
);

// 🔒 Ek user ek target par sirf ek review de sake
reviewSchema.index({ user: 1, targetId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;