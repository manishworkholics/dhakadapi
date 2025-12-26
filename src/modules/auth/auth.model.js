import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },

    createdfor: { type: String },

    // OTP Login (Phone)
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },

    // Block
    isBlocked: { type: Boolean, default: false },

    // Basic Profile
    name: { type: String, default: "" },

    // Email Login + Verification
    emailOtp: String,
    emailOtpExpires: Date,
    emailVerified: { type: Boolean, default: false },

    // ⭐ Forgot Password Feature
    resetOtp: { type: String, default: null },
    resetOtpExpires: { type: Date, default: null },
    resetOtpVerified: { type: Boolean, default: false },

    // Payment Module
    currentPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserPlan",
      default: null,
    },

    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("User", userSchema);
