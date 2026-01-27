import UserPlan from "../modules/plan/UserPlan.model.js";

export const checkPremiumPlan = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const activePlan = await UserPlan.findOne({
      user: userId,
      status: "active",
      endDate: { $gt: new Date() },
    }).populate("plan");

    if (!activePlan) {
      return res.status(403).json({
        success: false,
        code: "PREMIUM_REQUIRED",
        message: "Active premium plan required",
      });
    }

    req.userPlan = activePlan; // optional use later
    next();

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
