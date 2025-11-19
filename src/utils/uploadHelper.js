// import multer from "multer";
// import sharp from "sharp";
// import path from "path";
// import fs from "fs";

// // temp storage before upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = "uploads/";
//     if (!fs.existsSync(folder)) fs.mkdirSync(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   },
// });

// export const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
// });

// // compress image before upload
// export const compressImage = async (filePath) => {
//   const outputPath = filePath.replace(/(\.[\w\d_-]+)$/i, "_compressed$1");
//   await sharp(filePath)
//     .resize(800)
//     .jpeg({ quality: 80 })
//     .toFile(outputPath);
//   return outputPath;
// };



import multer from "multer";
import path from "path";
import fs from "fs";

// temp storage before upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = "uploads/";
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// removed sharp — now this does nothing, safe fallback
export const compressImage = async (filePath) => {
  return filePath; // no compression
};

