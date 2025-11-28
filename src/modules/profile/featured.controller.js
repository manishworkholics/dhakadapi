import {
  listFeaturedService,
  markFeaturedService,
  unmarkFeaturedService,
} from "./featured.service.js";

export const getFeaturedProfiles = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const profiles = await listFeaturedService(limit);
    res.status(200).json({ success: true, profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
