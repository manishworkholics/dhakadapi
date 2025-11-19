import User from "../auth/auth.model.js";
import Profile from "../profile/profile.model.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedProfiles = await Profile.countDocuments({ isVisible: true });
    const pendingProfiles = await Profile.countDocuments({ isVisible: false });

    const maleProfiles = await Profile.countDocuments({ gender: "Male" });
    const femaleProfiles = await Profile.countDocuments({ gender: "Female" });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        verifiedProfiles,
        pendingProfiles,
        maleProfiles,
        femaleProfiles,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
