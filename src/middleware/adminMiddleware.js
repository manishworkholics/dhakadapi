import jwt from "jsonwebtoken";
import Admin from "../modules/admin/admin.model.js";

export const adminProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) return res.status(401).json({ message: "Admin not found" });

      req.user = admin;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid admin token" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};
