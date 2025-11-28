// services/view.service.js
import Profile from "../profile/profile.model";

export const addProfileViewService = async (viewerId, profileId) => {
  await Profile.findByIdAndUpdate(
    profileId,
    {
      $push: {
        viewedBy: { userId: viewerId, viewedAt: new Date() }
      }
    },
    { new: true }
  );
};

export const getViewedProfilesService = async (viewerId) => {
  const profiles = await Profile.find({
    "viewedBy.userId": viewerId
  })
  .select("name photos location age religion occupation")
  .sort({ "viewedBy.viewedAt": -1 })
  .limit(20);

  return profiles;
};
