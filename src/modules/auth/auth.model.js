import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    createdfor: { type: String },
    password: { type: String },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }, // 👈 added
    name: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("User", userSchema);
