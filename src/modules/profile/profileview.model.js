import mongoose from "mongoose";

const profileViewSchema = new mongoose.Schema({
  viewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  viewedProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  viewedAt: { type: Date, default: Date.now }
}, { timestamps: true });

profileViewSchema.index({ viewer: 1, viewedProfile: 1 }, { unique: true }); // prevent duplicate views

export default mongoose.model("ProfileView", profileViewSchema);
