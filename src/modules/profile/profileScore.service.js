import Profile from "./profile.model.js";
import { scoreFields } from "./profileScore.helper.js";

export const calculateProfileScore = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) return 0;

  let filledCount = 0;

  scoreFields.forEach(field => {
    const value = profile[field];

    if (Array.isArray(value)) {
      if (value.length > 0) filledCount++;
    } else if (value && value !== "" && value !== null) {
      filledCount++;
    }
  });

  const score = Math.round((filledCount / scoreFields.length) * 100);

  profile.profileScore = score;
  await profile.save();

  return score;
};
