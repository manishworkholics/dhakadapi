import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    createdfor: { type: String },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }, // 👈 added
    name: { type: String, default: "" },
    emailOtp: String,
    emailOtpExpires: Date,
    emailVerified: { type: Boolean, default: false },
    currentPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserPlan",
      default: null,
    }
    ,
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("User", userSchema);
