import { createAdminService, adminLoginService } from "./admin.service.js";
import Admin from "./admin.model.js";



import bcrypt from "bcrypt";
import User from "../auth/auth.model.js";
import PartnerPreference from "../match/PartnerPreference.model.js";
import Payment from "../plan/Payment.model.js";
import Profile from "../profile/profile.model.js";
import Role from "./role.model.js";
import AdminLog from "./adminLog.model.js";
import Permission from "./permission.model.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // =================================================
    // RUN ALL QUERIES IN PARALLEL (FAST ⚡)
    // =================================================
    const [
      totalUsers,
      activeMatches,
      revenueAgg,
      activeToday,
      userGrowthAgg,
      revenueOverviewAgg,
      recentUsers
    ] = await Promise.all([

      // ================= TOTAL USERS =================
      User.countDocuments(),

      // ================= ACTIVE MATCHES =================
      // YOUR DB uses isActive, NOT status
      PartnerPreference.countDocuments({
        isActive: true
      }),

      // ================= TOTAL REVENUE =================
      // YOUR DB uses status: "paid"
      Payment.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]),

      // ================= ACTIVE TODAY =================
      // fallback to updatedAt if lastActiveAt not present
      User.countDocuments({
        updatedAt: { $gte: todayStart }
      }),

      // ================= USER GROWTH (MONTHLY) =================
      User.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // ================= REVENUE OVERVIEW (MONTHLY) =================
      Payment.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            amount: { $sum: "$amount" }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // ================= RECENT USERS =================
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name createdAt")
        .lean()
    ]);

    // =================================================
    // FORMAT RESPONSE
    // =================================================

    const revenue = revenueAgg[0]?.total || 0;

    const userGrowth = userGrowthAgg.map(item => ({
      month: item._id,
      count: item.count
    }));

    const revenueOverview = revenueOverviewAgg.map(item => ({
      month: item._id,
      amount: item.amount
    }));

    const recentActivities = recentUsers.map(u => ({
      type: "REGISTER",
      message: `${u.name} registered`,
      time: u.createdAt
    }));

    // =================================================
    // FINAL RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeMatches,
        revenue,
        activeToday
      },
      userGrowth,
      revenueOverview,
      recentActivities
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;

    if (!email || !password || !roleName) {
      return res.status(400).json({ message: "All fields required" });
    }

    const role = await Role.findOne({ name: roleName });

    if (!role) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      roles: [role._id],
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
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

export const createRole = async (req, res) => {
  try {

    const { name, permissions } = req.body;

    const role = await Role.create({
      name,
      permissions
    });

    res.status(201).json({
      success: true,
      role
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

export const updateRolePermissions = async (req, res) => {
  try {

    const { permissions } = req.body;

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { permissions },
      { new: true }
    ).populate("permissions", "name");

    res.status(200).json({
      success: true,
      role
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};



// CREATE PERMISSION
export const createPermission = async (req, res) => {
  try {

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Permission name required"
      });
    }

    const exists = await Permission.findOne({ name });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Permission already exists"
      });
    }

    const permission = await Permission.create({
      name,
      description
    });

    res.status(201).json({
      success: true,
      permission
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};



// GET ALL PERMISSIONS
export const getPermissions = async (req, res) => {
  try {

    const permissions = await Permission.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      permissions
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};



// DELETE PERMISSION
export const deletePermission = async (req, res) => {
  try {

    await Permission.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Permission deleted"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

export const getRoles = async (req, res) => {
  try {

    const roles = await Role.find()
      .populate("permissions", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      roles
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};


export const getAllAdmins = async (req, res) => {
  try {

    const admins = await Admin.find()
      .populate("roles", "name")
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      admins
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getAdminLogs = async (req, res) => {

  try {

    const logs = await AdminLog.find()
      .populate("admin", "name email")
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({
      success: true,
      logs
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}