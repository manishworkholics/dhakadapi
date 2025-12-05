import Shortlist from "../shortlist/shortlist.model.js";
import Profile from "../profile/profile.model.js";


// ------------------ ADD TO SHORTLIST ------------------
export const addShortlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profileId } = req.params;

    // Prevent self-shortlisting
    const profile = await Profile.findById(profileId);
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
    if (profile.userId.toString() === userId.toString())
      return res.status(400).json({ success: false, message: "You can't shortlist your own profile" });

    let existing = await Shortlist.findOne({ user: userId, profile: profileId });

    if (existing) {
      // If exists, just reactivate if inactive
      if (!existing.active) {
        existing.active = true;
        await existing.save();
      }
      return res.json({ success: true, message: "Profile already shortlisted" });
    }

    await Shortlist.create({ user: userId, profile: profileId });

    res.json({ success: true, message: "Profile added to shortlist" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ------------------ REMOVE SHORTLIST ------------------
export const removeShortlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profileId } = req.params;

    const existing = await Shortlist.findOne({ user: userId, profile: profileId });

    if (!existing)
      return res.status(404).json({ success: false, message: "Not found in shortlist" });

    // Soft delete for analytics
    existing.active = false;
    await existing.save();

    res.json({ success: true, message: "Profile removed from shortlist" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ------------------ GET SHORTLISTED PROFILES ------------------
export const getShortlistedProfiles = async (req, res) => {
  try {
    const userId = req.user._id;

    const shortlist = await Shortlist.find({
      user: userId,
      active: true
    })
      .populate("profile", "name dob location occupation photos religion education")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: shortlist.length, shortlist });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
