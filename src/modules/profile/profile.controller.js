import {
  createProfileService,
  updateProfileService,
  getProfileService,
  searchProfilesService,
} from "./profile.service.js";

export const createProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await createProfileService(userId, req.body);
    res.status(201).json({ success: true, profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await updateProfileService(userId, req.body);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await getProfileService(userId);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const searchProfiles = async (req, res) => {
  try {
    const profiles = await searchProfilesService(req.query);
    res.status(200).json({ success: true, results: profiles.length, profiles });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
