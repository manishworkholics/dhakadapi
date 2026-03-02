import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    targetType: {
      type: String,
      enum: ["User", "Profile", "Payment", "Admin"],
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    metadata: {
      type: Object,
    },

    ipAddress: String,

  },
  { timestamps: true }
);

export default mongoose.model("AdminLog", adminLogSchema);