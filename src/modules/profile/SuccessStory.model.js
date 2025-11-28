import mongoose from "mongoose";

const successSchema = new mongoose.Schema(
  {
    title: { type: String },            // optional
    name: { type: String },             // partner 1 name
    partnerName: { type: String },      // partner 2 name
    story: { type: String },
    image: { type: String },            // URL
    featured: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("SuccessStory", successSchema);
