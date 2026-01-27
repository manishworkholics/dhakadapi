import Profile from "./profile.model.js";

import { getOppositeGender } from "../../utils/gender.util.js";

// export const listFeaturedService = async (gender,limit = 10) => {
//   const profiles = await Profile.find({ featured: true, isVisible: true,gender }).limit(Number(limit)).lean();
//   return profiles;
// };


export const listFeaturedService = async (limit = 10, gender) => {
  const profiles = await Profile.find({
    featured: true,
    isVisible: true,
    gender
  })
    .limit(Number(limit))
    .lean();

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
