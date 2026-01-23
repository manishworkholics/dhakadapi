import cloudinary from "../../config/cloudinary.js";

/* ================= UPLOAD ================= */

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "dhakad_matrimony" },
      (error, uploadResult) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        }

        res.status(200).json({
          success: true,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id, // 🔥 optional but useful
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= PUBLIC ID EXTRACTOR ================= */

/* ================= DELETE ================= */
const getPublicIdFromUrl = (url) => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
  return match ? match[1] : null;
};


export const deleteImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid URL" });
    }

    const publicId = match[1];

    console.log("Deleting publicId:", publicId);

    let result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      type: "upload",
    });

    // fallback attempts
    if (result.result === "not found") {
      result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        type: "private",
      });
    }

    if (result.result === "not found") {
      result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
      });
    }

    if (result.result !== "ok") {
      return res.status(400).json({
        success: false,
        message: "Failed to delete image from Cloudinary",
        cloudinaryResult: result,
      });
    }

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const checkImage = async (req, res) => {
  try {
    const publicId = "dhakad_matrimony/do4t6vgmutqaei5pp";

    const result = await cloudinary.api.resource(publicId);

    res.json({
      found: true,
      data: result,
    });
  } catch (err) {
    res.json({
      found: false,
      error: err.message,
    });
  }
};
