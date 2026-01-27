import {
  listFeaturedService,
  markFeaturedService,
  unmarkFeaturedService,
} from "./featured.service.js";
import { getOppositeGender } from "../../utils/gender.util.js";
import Profile from "../profile/profile.model.js";

export const getFeaturedProfiles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const userId = req.user._id;

    // ✅ Get logged-in user's profile
    const myProfile = await Profile.findOne({ userId });

    if (!myProfile) {
      return res.status(404).json({
        success: false,
        message: "Your profile not found",
      });
    }

    const oppositeGender = getOppositeGender(myProfile.gender);

    const profiles = await listFeaturedService(limit, oppositeGender);

    res.status(200).json({
      success: true,
      profiles,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markFeatured = async (req, res) => {
  try {
    const { profileId } = req.body;
    const updated = await markFeaturedService(profileId);
    res.status(200).json({ success: true, message: "Profile marked featured", profile: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const unmarkFeatured = async (req, res) => {
  try {
    const { profileId } = req.body;
    const updated = await unmarkFeaturedService(profileId);
    res.status(200).json({ success: true, message: "Profile unmarked", profile: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
