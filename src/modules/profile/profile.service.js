import Profile from "./profile.model.js";

export const createProfileService = async (userId, data) => {
  const existing = await Profile.findOne({ userId });
  if (existing) throw new Error("Profile already exists");
  const profile = await Profile.create({ userId, ...data });
  return profile;
};

export const updateProfileService = async (userId, data) => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: data, updatedAt: Date.now() },
    { new: true }
  );
  if (!profile) throw new Error("Profile not found");
  return profile;
};

export const getProfileService = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new Error("Profile not found");
  return profile;
};

export const searchProfilesService = async (filters) => {
  const query = {};
  if (filters.gender) query.gender = filters.gender;
  if (filters.community) query.community = filters.community;
  if (filters.location) query["location.city"] = { $regex: filters.location, $options: "i" };
  if (filters.education) query.education = filters.education;

  const profiles = await Profile.find(query).limit(50).lean();
  return profiles;
};
