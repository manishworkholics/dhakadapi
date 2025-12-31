import mongoose from "mongoose";

const partnerPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 🔹 Basic
    ageFrom: Number,
    ageTo: Number,

    heightFrom: String,
    heightTo: String,

    maritalStatus: [String],

    // 🔹 Religion & Community
    religion: String,
    caste: String,
    motherTongue: String,

    // 🔹 Education & Career
    educationDetails: [String],
    employmentType: [String],
    annualIncomeFrom: Number,
    annualIncomeTo: Number,

    // 🔹 Location
    preferredCity: [String],
    preferredState: [String],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("PartnerPreference", partnerPreferenceSchema);
