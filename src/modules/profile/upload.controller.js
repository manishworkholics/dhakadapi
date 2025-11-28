import cloudinary from "../../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload_stream(
      { folder: "dhakad_matrimony" },
      (error, uploadResult) => {
        if (error) {
          return res.status(500).json({ success: false, message: error.message });
        }

        res.status(200).json({
          success: true,
          url: uploadResult.secure_url
        });
      }
    );

    result.end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
