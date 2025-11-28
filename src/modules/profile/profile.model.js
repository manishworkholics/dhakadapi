import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Step 1
    name: { type: String },
    dob: { type: Date },
    motherTongue: { type: String },
    email: { type: String },
    location: { type: String },

    // Step 2
    height: { type: String },
    physicalStatus: { type: String, enum: ["Normal", "Physically challenged"] },
    maritalStatus: {
      type: String,
      enum: ["Never married", "Widower", "Awaiting divorce", "Divorced"],
    },
    religion: { type: String },
    caste: { type: String },
    subCaste: { type: String },
    gotra: { type: String },

    // Step 3
    educationDetails: { type: String },
    employmentType: { type: String },
    occupation: { type: String },
    annualIncome: { type: String },

    // Step 4
    familyStatus: {
      type: String,
      enum: ["Middle class", "Upper middle class", "Rich / Affluent (Elite)"],
    },
    diet: {
      type: String,
      enum: ["Veg", "Nonveg", "Occasionally Non-Veg", "Vegan"],
    },
    aboutYourself: { type: String },

    // Step 5
    photos: [String],
    introVideo: String,

    // Optional
    aiBio: String,
    profileScore: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },

    featured: { type: Boolean, default: false },

    // profile.model.js
    viewedBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        viewedAt: { type: Date, default: Date.now }
      }
    ]


  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Profile", profileSchema);
