import bcrypt from "bcrypt";
import Admin from "./admin.model.js";
import { generateToken } from "../../utils/jwtHelper.js";

export const createAdminService = async (name, email, password) => {
  const exists = await Admin.findOne({ email });
  if (exists) throw new Error("Admin already exists");

  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ name, email, password: hashed });
  return admin;
};

export const adminLoginService = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, admin.password);
  if (!match) throw new Error("Invalid credentials");

  const token = generateToken(admin._id);
  return { admin, token };
};
