// models/notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // receiver
  type: { type: String, enum: ["PROFILE_VIEW"], required: true },
  message: String,

  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who triggered
  profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },

  isRead: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
