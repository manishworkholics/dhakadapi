// services/match.service.js
import Profile from "../profile/profile.model";

export const getNewMatchesService = async (userId) => {
  const myProfile = await Profile.findOne({ userId });

  if (!myProfile) return [];

  return await Profile.find({
    userId: { $ne: userId },
    gender: myProfile.gender === "Male" ? "Female" : "Male",
    religion: myProfile.religion || { $exists: true }
  })
  .select("name photos location age religion occupation")
  .limit(20);
};
