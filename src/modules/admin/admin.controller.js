import { createAdminService, adminLoginService } from "./admin.service.js";
import Admin from "./admin.model.js";




import User from "../auth/auth.model.js";
import PartnerPreference from "../match/PartnerPreference.model.js";
import Payment from "../plan/Payment.model.js";
import Profile from "../profile/profile.model.js";

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
