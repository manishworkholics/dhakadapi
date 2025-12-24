import mongoose from "mongoose";

const userPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending", // later payment integration
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserPlan", userPlanSchema);
