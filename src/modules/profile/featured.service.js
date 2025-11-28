import Profile from "./profile.model.js";

export const listFeaturedService = async (limit = 10) => {
  const profiles = await Profile.find({ featured: true, isVisible: true }).limit(Number(limit)).lean();
  return profiles;
};

export const markFeaturedService = async (profileId) => {
  const profile = await Profile.findByIdAndUpdate(profileId, { featured: true }, { new: true });
  if (!profile) throw new Error("Profile not found");
  return profile;
};

export const unmarkFeaturedService = async (profileId) => {
  const profile = await Profile.findByIdAndUpdate(profileId, { featured: false }, { new: true });
  if (!profile) throw new Error("Profile not found");
  return profile;
};
