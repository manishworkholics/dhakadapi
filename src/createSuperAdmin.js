import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Admin from "./modules/admin/admin.model.js";
import Role from "./modules/admin/role.model.js";

dotenv.config(); // load .env

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    const role = await Role.findOne({ name: "SuperAdmin" });

    if (!role) {
      console.log("SuperAdmin role not found. Run seed first.");
      process.exit();
    }

    const existing = await Admin.findOne({
      email: "superadmin@dhakad.com",
    });

    if (existing) {
      console.log("SuperAdmin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    const admin = await Admin.create({
      name: "Super Admin",
      email: "superadmin@dhakad.com",
      password: hashedPassword,
      roles: [role._id],
    });

    console.log("SuperAdmin created successfully:", admin.email);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createSuperAdmin();