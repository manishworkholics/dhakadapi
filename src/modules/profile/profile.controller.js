import {
  createProfileService,
  updateProfileService,
  getProfileService,
  searchProfilesService,
} from "./profile.service.js";
import { getOppositeGender } from "../../utils/gender.util.js";
import Profile from "./profile.model.js";
import { calculateProfileScore } from "./profileScore.service.js";
import UserPlan from "../plan/UserPlan.model.js";
import User from "../auth/auth.model.js";

export const createProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if profile exists
    let existingProfile = await Profile.findOne({ userId });

    if (existingProfile) {
      // UPDATE EXISTING PROFILE
      const updatedProfile = await Profile.findOneAndUpdate(
        { userId },
        req.body,
        { new: true }
      );

      const profileScore = await calculateProfileScore(userId);

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        profile: updatedProfile,
        profileScore
      });
    }

    // CREATE NEW PROFILE
    const newProfile = await Profile.create({ userId, ...req.body });

    const profileScore = await calculateProfileScore(userId);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: newProfile,
      profileScore
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// ⭐ UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await updateProfileService(userId, req.body);

    // Auto Score Update
    const profileScore = await calculateProfileScore(userId);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
      profileScore
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// export const getProfile = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const profile = await getProfileService(userId);

//     res.status(200).json({ success: true, profile });

//   } catch (error) {
//     res.status(404).json({ success: false, message: error.message });
//   }
// };


export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await getProfileService(userId);

    // ✅ Check premium plan
    const activePlan = await UserPlan.findOne({
      user: userId,
      status: "active",
      endDate: { $gt: new Date() },
    });

    const hasPremiumAccess = !!activePlan;

    res.status(200).json({
      success: true,
      profile,
      hasPremiumAccess,   // ✅ important
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};



// GET /api/profile/filters
export const getFilterOptions = async (req, res) => {
  try {
    const clean = (arr) => {
      return [...new Set(
        arr
          .filter(v => v && v.trim() !== "") // remove null, empty, spaces
          .map(v => v.trim())               // remove extra spaces
      )];
    };

    const religions = clean(await Profile.distinct("religion"));
    const locations = clean(await Profile.distinct("location"));
    const education = clean(await Profile.distinct("education"));
    const occupations = clean(await Profile.distinct("occupation"));

    res.json({
      success: true,
      filters: {
        religions,
        locations,
        education,
        occupations
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load filter options",
      error: err.message
    });
  }
};



// export const getProfileById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const profile = await Profile.findById(id);
//     if (!profile) {
//       return res.status(404).json({ success: false, message: "Profile not found" });
//     }

//     res.status(200).json({ success: true, profile });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getProfileById = async (req, res) => {
//   try {
//     const { id } = req.params; // profile id
//     const viewerId = req.user?._id;

//     // 1. Get profile
//     const profile = await Profile.findById(id).lean();

//     if (!profile) {
//       return res.status(404).json({
//         success: false,
//         message: "Profile not found",
//       });
//     }

//     // 2. Get user (for phone & email)
//     const profileUser = await User.findById(profile.userId)
//       .select("phone email")
//       .lean();

//     // 3. Premium check
//     let hasPremiumAccess = false;

//     if (viewerId) {
//       const activePlan = await UserPlan.findOne({
//         user: viewerId,
//         status: "active",
//         endDate: { $gt: new Date() },
//       });

//       hasPremiumAccess = !!activePlan;
//     }

//     // 4. Attach or hide sensitive fields
//     if (hasPremiumAccess && profileUser) {
//       profile.phone = profileUser.phone;
//       profile.email = profileUser.email;
//     } else {
//       profile.phone = "🔒 Upgrade to premium to view contact details";
//       profile.email = "🔒 Upgrade to premium to view contact details";
//     }

//     res.status(200).json({
//       success: true,
//       profile,
//       hasPremiumAccess,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params; // profile id
    const viewerId = req.user?._id;

    // 1. Get profile
    const profile = await Profile.findById(id).lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // 2. Get user (for phone & email)
    const profileUser = await User.findById(profile.userId)
      .select("phone email")
      .lean();

    // 3. Premium check
    let hasPremiumAccess = false;

    if (viewerId) {
      const activePlan = await UserPlan.findOne({
        user: viewerId,
        status: "active",
        endDate: { $gt: new Date() },
      });

      hasPremiumAccess = !!activePlan;
    }

    // 4. Attach or hide sensitive fields
    if (hasPremiumAccess && profileUser) {
      profile.phone = profileUser.phone;
      profile.email = profileUser.email;
    } else {
      profile.phone = "🔒 Upgrade to premium to view contact details";
      profile.email = "🔒 Upgrade to premium to view contact details";
    }

    // 5. Restrict photos for non-premium users
    if (!hasPremiumAccess && Array.isArray(profile.photos)) {
      profile.photos = profile.photos.length > 0 ? [profile.photos[0]] : [];
    }

    res.status(200).json({
      success: true,
      profile,
      hasPremiumAccess,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const getOwnProfileById = async (req, res) => {
//   try {
//     const { id } = req.params; // this is actually userId from session/auth

//     // Find profile by userId field, not _id
//     const profile = await Profile.findOne({ userId: id });

//     if (!profile) {
//       return res.status(404).json({ success: false, message: "Profile not found" });
//     }

//     res.status(200).json({ success: true, profile });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


export const getOwnProfileById = async (req, res) => {
  try {
    const { id } = req.params; // userId from auth/session

    // 1. Get profile by userId
    const profile = await Profile.findOne({ userId: id }).lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // 2. Get user phone & email
    const user = await User.findById(id)
      .select("phone email")
      .lean();

    // 3. Check premium plan
    const activePlan = await UserPlan.findOne({
      user: id,
      status: "active",
      endDate: { $gt: new Date() },
    });

    const hasPremiumAccess = !!activePlan;

    // 4. Attach phone & email (always allowed for own profile)
    profile.phone = user?.phone || null;
    profile.email = user?.email || null;

    res.status(200).json({
      success: true,
      profile,
      hasPremiumAccess,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ⭐ SEARCH PROFILES (Filter, Sort, Pagination)
export const searchProfiles = async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ userId: req.user._id });

    if (!myProfile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const profiles = await searchProfilesService(req.query, myProfile);
    res.status(200).json({
      success: true,
      results: profiles.length,
      profiles
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// ⭐ MANUAL SCORE CHECK (optional)
export const updateProfileScore = async (req, res) => {
  try {
    const score = await calculateProfileScore(req.user._id);
    res.status(200).json({ success: true, score });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ⭐ GET ALL PROFILES (Homepage/Search List)
export const getAllProfiles = async (req, res) => {
  try {
    let {
      userId,
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
    if (userId) {
      query.userId = { $ne: userId };   // or userId field depending on schema
    }

    const myProfile = await Profile.findOne({ userId: req.user._id });

    if (!myProfile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const oppositeGender = getOppositeGender(myProfile.gender);

    if (oppositeGender) {
      query.gender = oppositeGender;
    }

    if (gender) query.gender = gender;
    if (religion) query.religion = religion;
    if (location) query["location"] = { $regex: location, $options: "i" };
    if (education) query.educationDetails = { $regex: education, $options: "i" };
    if (profession) query.occupation = { $regex: profession, $options: "i" };
    if (search) query.name = { $regex: search, $options: "i" };

    // 🎯 Age Filter by DOB
    if (ageMin || ageMax) {
      const today = new Date();
      query.dob = {};

      if (ageMin) {
        const maxDOB = new Date(today.setFullYear(today.getFullYear() - ageMin));
        query.dob.$lte = maxDOB;
      }

      if (ageMax) {
        const minDOB = new Date(new Date().setFullYear(new Date().getFullYear() - ageMax));
        query.dob.$gte = minDOB;
      }
    }

    // 💠 Sorting Options
    let sort = {};
    if (sortBy === "latest") sort.createdAt = -1;
    if (sortBy === "ageLowToHigh") sort.dob = -1;
    if (sortBy === "ageHighToLow") sort.dob = 1;

    const profiles = await Profile.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Profile.countDocuments(query);



    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      results: profiles.length,
      profiles,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ⭐ GET RELATED PROFILES
export const getRelatedProfiles = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get own profile first
    const myProfile = await Profile.findOne({ userId });
    if (!myProfile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found"
      });
    }

    const {
      gender,
      religion,
      location,
      dob
    } = myProfile;

    // 🎯 Age range ±5 years
    const today = new Date();
    const age = today.getFullYear() - new Date(dob).getFullYear();

    const minDOB = new Date(today.setFullYear(today.getFullYear() - (age + 5)));
    const maxDOB = new Date(new Date().setFullYear(new Date().getFullYear() - (age - 5)));

    const relatedProfiles = await Profile.find({
      isVisible: true,

      // ❌ Exclude own profile
      userId: { $ne: userId },

      // ❌ Opposite gender
      gender: { $ne: gender },

      // ✅ Similar preferences
      religion,
      location,

      // 🎯 Age range
      dob: {
        $gte: minDOB,
        $lte: maxDOB
      }
    })
      .sort({ profileScore: -1, createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      results: relatedProfiles.length,
      profiles: relatedProfiles
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
