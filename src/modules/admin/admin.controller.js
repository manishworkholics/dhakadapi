import { createAdminService, adminLoginService } from "./admin.service.js";
import Admin from "./admin.model.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const admin = await createAdminService(name, email, password);
    res.status(201).json({ success: true, message: "Admin created", admin });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { admin, token } = await adminLoginService(email, password);
    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, admin });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
