import {
  createProfileService,
  updateProfileService,
  getProfileService,
  searchProfilesService,
} from "./profile.service.js";

import Profile from "./profile.model.js";
import { calculateProfileScore } from "./profileScore.service.js";


// ⭐ CREATE PROFILE
export const createProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await createProfileService(userId, req.body);

    // Auto Score Update
    const profileScore = await calculateProfileScore(userId);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
      profileScore
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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




// /api/profile/profiles
// export const getProfile = async (req, res) => {
//   try {
//     let {
//       gender,
//       religion,
//       location,
//       education,
//       profession,
//       sortBy,
//       search,
//       ageMin,
//       ageMax
//     } = req.query;

//     let query = {};

//     /** ---------------- AGE RANGE FILTER ---------------- **/
//     if (ageMin || ageMax) {
//       const now = new Date();
//       const dobFilter = {};

//       if (ageMin) {
//         const maxBirthDate = new Date(now.getFullYear() - ageMin, now.getMonth(), now.getDate());
//         dobFilter.$lte = maxBirthDate;
//       }

//       if (ageMax) {
//         const minBirthDate = new Date(now.getFullYear() - ageMax, now.getMonth(), now.getDate());
//         dobFilter.$gte = minBirthDate;
//       }

//       query.dob = dobFilter;
//     }

//     /** ---------------- BASIC FILTERS ---------------- **/
//     if (gender) query.gender = gender;
//     if (religion) query.religion = religion;
//     if (location) query.location = { $regex: location, $options: "i" };
//     if (education) query.education = education;
//     if (profession) query.occupation = profession;

//     /** ---------------- SEARCH FILTER ---------------- **/
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { location: { $regex: search, $options: "i" } },
//         { occupation: { $regex: search, $options: "i" } }
//       ];
//     }

//     /** ---------------- SORTING ---------------- **/
//     const sortOrder = sortBy === "latest"
//       ? { createdAt: -1 }
//       : { profileScore: -1 }; // default: best match first

//     /** ---------------- FETCH PROFILES ---------------- **/
//     const profiles = await Profile.find(query).sort(sortOrder).limit(100);

//     return res.json({ success: true, profiles });

//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

export const getProfile = async (req, res) => {
  try {
    let {
      gender,
      religion,
      location,
      education,
      profession,
      sortBy,
      search,
      ageMin,
      ageMax,
      userId   // <-- get logged user id
    } = req.query;

    let query = {};

    /** 🔥 EXCLUDE CURRENT USER FROM RESULTS */
    if (userId) {
      query._id = { $ne: userId };
    }

    /** ---------------- AGE RANGE FILTER ---------------- **/
    if (ageMin || ageMax) {
      const now = new Date();
      const dobFilter = {};

      if (ageMin) {
        const maxBirthDate = new Date(now.getFullYear() - ageMin, now.getMonth(), now.getDate());
        dobFilter.$lte = maxBirthDate;
      }

      if (ageMax) {
        const minBirthDate = new Date(now.getFullYear() - ageMax, now.getMonth(), now.getDate());
        dobFilter.$gte = minBirthDate;
      }

      query.dob = dobFilter;
    }

    /** ---------------- BASIC FILTERS ---------------- **/
    if (gender) query.gender = gender;
    if (religion) query.religion = religion;
    if (location) query.location = { $regex: location, $options: "i" };
    if (education) query.education = education;
    if (profession) query.occupation = profession;

    /** ---------------- SEARCH FILTER ---------------- **/
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { occupation: { $regex: search, $options: "i" } }
      ];
    }

    /** ---------------- SORTING ---------------- **/
    const sortOrder = sortBy === "latest"
      ? { createdAt: -1 }
      : { profileScore: -1 };

    /** ---------------- FETCH PROFILES ---------------- **/
    const profiles = await Profile.find(query).sort(sortOrder).limit(100);

    return res.json({ success: true, profiles });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};



// GET /api/profile/filters
export const getFilterOptions = async (req, res) => {
  const religions = await Profile.distinct("religion");
  const locations = await Profile.distinct("location");
  const education = await Profile.distinct("education");
  const occupations = await Profile.distinct("occupation");

  res.json({
    success: true,
    filters: { religions, locations, education, occupations }
  });
};


// ⭐ GET PROFILE BY ID
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, profile });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ⭐ SEARCH PROFILES (Filter, Sort, Pagination)
export const searchProfiles = async (req, res) => {
  try {
    const profiles = await searchProfilesService(req.query);
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
