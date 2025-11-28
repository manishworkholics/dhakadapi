import cloudinary from "../../config/cloudinary.js";
import fs from "fs";
import { compressImage } from "../../utils/uploadHelper.js";
import Profile from "./profile.model.js";

// export const uploadProfilePhoto = async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) return res.status(400).json({ message: "No file uploaded" });

//     const compressed = await compressImage(file.path);
//     const uploadRes = await cloudinary.uploader.upload(compressed, {
//       folder: "dhakad_matrimony/photos",
//     });

//     // attach to user profile
//     await Profile.findOneAndUpdate(
//       { userId: req.user._id },
//       { $push: { photos: uploadRes.secure_url } }
//     );

//     fs.unlinkSync(file.path);
//     fs.unlinkSync(compressed);

//     res.status(200).json({
//       success: true,
//       url: uploadRes.secure_url,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


export const uploadProfilePhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Since sharp is removed, file path = final path
    const finalPath = file.path;

    const uploadRes = await cloudinary.uploader.upload(finalPath, {
      folder: "dhakad_matrimony/photos",
    });

    // Save uploaded image URL to database
    await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $push: { photos: uploadRes.secure_url } }
    );

    // Delete only once
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }

    return res.status(200).json({
      success: true,
      url: uploadRes.secure_url,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

<<<<<<< HEAD
// export const uploadImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Image uploaded successfully",
//       filePath: `/uploads/${req.file.filename}`,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };

=======
>>>>>>> 31c2d10740a7460754ef4c1d0b1231db569f16e7

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
