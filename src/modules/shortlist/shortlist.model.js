import mongoose from "mongoose";

const shortlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    // If user removes & adds again, this can help.
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

shortlistSchema.index({ user: 1, profile: 1 }, { unique: true });

export default mongoose.model("Shortlist", shortlistSchema);
