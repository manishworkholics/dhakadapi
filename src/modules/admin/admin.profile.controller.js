import Profile from "../profile/profile.model.js";

// Get all pending profiles (to verify)
export const getPendingProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ isVisible: false })
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: profiles.length, profiles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Approve profile
export const approveProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findByIdAndUpdate(
      id,
      { isVisible: true },
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ success: true, message: "Profile approved", profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reject profile (hide)
export const rejectProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findByIdAndUpdate(
      id,
      { isVisible: false },
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ success: true, message: "Profile rejected", profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
