import cloudinary from "../../config/cloudinary.js";
import fs from "fs";
import { compressImage } from "../../utils/uploadHelper.js";
import Profile from "./profile.model.js";

export const uploadProfilePhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const compressed = await compressImage(file.path);
    const uploadRes = await cloudinary.uploader.upload(compressed, {
      folder: "dhakad_matrimony/photos",
    });

    // attach to user profile
    await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $push: { photos: uploadRes.secure_url } }
    );

    fs.unlinkSync(file.path);
    fs.unlinkSync(compressed);

    res.status(200).json({
      success: true,
      url: uploadRes.secure_url,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadIntroVideo = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No video uploaded" });

    const uploadRes = await cloudinary.uploader.upload(file.path, {
      resource_type: "video",
      folder: "dhakad_matrimony/videos",
    });

    await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { introVideo: uploadRes.secure_url }
    );

    fs.unlinkSync(file.path);

    res.status(200).json({
      success: true,
      url: uploadRes.secure_url,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
