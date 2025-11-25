import Profile from "./profile.model.js";

// -----------------------------
// CREATE PROFILE
// -----------------------------
export const createProfileService = async (userId, data) => {
  const existing = await Profile.findOne({ userId });
  if (existing) throw new Error("Profile already exists");

  // Create new profile
  const profile = await Profile.create({
    userId,
    ...data,
  });

  return profile;
};

// -----------------------------
// UPDATE PROFILE
// -----------------------------
export const updateProfileService = async (userId, data) => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    {
      $set: { ...data, updatedAt: Date.now() },
    },
    { new: true }
  );

  if (!profile) throw new Error("Profile not found");

  return profile;
};

// -----------------------------
// GET PROFILE (own profile)
// -----------------------------
export const getProfileService = async (userId) => {
  const profile = await Profile.findOne({ userId });

  if (!profile) throw new Error("Profile not found");

  return profile;
};

// -----------------------------
// SEARCH PROFILES (New Logic)
// -----------------------------
export const searchProfilesService = async (filters) => {
  const query = {};

  // Gender
  if (filters.gender) query.gender = filters.gender;

  // Religion
  if (filters.religion) query.religion = filters.religion;

  // Caste
  if (filters.caste) query.caste = filters.caste;

  // Education (mapped to educationDetails)
  if (filters.education) {
    query.educationDetails = { $regex: filters.education, $options: "i" };
  }

  // Location (if you store city in future)
  if (filters.city) {
    query["location.city"] = { $regex: filters.city, $options: "i" };
  }

  // Height range
  if (filters.minHeight && filters.maxHeight) {
    query.height = { $gte: filters.minHeight, $lte: filters.maxHeight };
  }

  // Marital status
  if (filters.maritalStatus) {
    query.maritalStatus = filters.maritalStatus;
  }

  // Diet preference
  if (filters.diet) {
    query.diet = filters.diet;
  }

  // Fetch results
  const profiles = await Profile.find(query).limit(50).lean();

  return profiles;
};
