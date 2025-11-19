import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    dob: { type: Date, required: true },
    community: { type: String, required: true },
    location: {
      city: String,
      state: String,
      country: String,
    },
    education: String,
    profession: String,
    income: String,
    familyDetails: {
      fatherName: String,
      motherName: String,
      siblings: Number,
      familyType: String,
    },
    lifestyle: {
      diet: String,
      drinking: String,
      smoking: String,
    },
    photos: [String],
    introVideo: String,
    bio: String,
    aiBio: String,
    preferences: {
      ageRange: [Number],
      location: [String],
      community: [String],
      education: [String],
    },
    profileScore: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("Profile", profileSchema);
