import {
  createProfileService,
  updateProfileService,
  getProfileService,
  searchProfilesService,
} from "./profile.service.js";
import Profile from "./profile.model.js"

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

export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL

    if (!id) {
      return res.status(400).json({ success: false, message: "Profile ID is required" });
    }

    const profile = await Profile.findById(id);

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllProfiles = async (req, res) => {
  try {
    let {
      gender,
      religion,
      location,
      education,
      profession,
      search,
      page = 1,
      limit = 20,
      ageMin,
      ageMax,
      sortBy
    } = req.query;

    const skip = (page - 1) * limit;

    const query = { isVisible: true };

    if (gender) query.gender = gender;
    if (religion) query.religion = religion;
    if (location) query["location.city"] = { $regex: location, $options: "i" };
    if (education) query.education = education;
    if (profession) query.profession = { $regex: profession, $options: "i" };
    if (search) query.name = { $regex: search, $options: "i" };

    // Age Filter: Convert DOB to age logic
    if (ageMin || ageMax) {
      const now = new Date();
      if (ageMin) {
        const maxDob = new Date(now.setFullYear(now.getFullYear() - ageMin));
        query.dob = { ...(query.dob || {}), $lte: maxDob };
      }
      if (ageMax) {
        const minDob = new Date(now.setFullYear(now.getFullYear() - ageMax));
        query.dob = { ...(query.dob || {}), $gte: minDob };
      }
    }

    // Sort handling
    let sort = {};
    if (sortBy === "latest") sort.createdAt = -1;
    if (sortBy === "ageLowToHigh") sort.dob = -1;
    if (sortBy === "ageHighToLow") sort.dob = 1;

    const profiles = await Profile.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select("-updatedAt -preferences -aiBio"); // remove sensitive/extra fields

    const total = await Profile.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      results: profiles.length,
      profiles
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
