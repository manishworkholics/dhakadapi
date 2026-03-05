



import jwt from "jsonwebtoken";
import Admin from "../modules/admin/admin.model.js";

export const adminProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id)
      .populate({
        path: "roles",
        populate: {
          path: "permissions",
        },
      });

    if (!admin || !admin.isActive) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.admin = admin; // attach full admin object
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};