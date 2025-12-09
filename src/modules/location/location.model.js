import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    state: { type: String, required: true },
    cities: { type: [String], required: true }
}, { timestamps: true });


export default mongoose.model("Location", locationSchema);
