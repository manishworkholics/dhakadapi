import ProfileView from "../profile/profileview.model.js";
import Notification from "../notification/notification.model.js";
import Profile from "../profile/profile.model.js";

// export const markProfileViewed = async (req, res) => {
//   try {
//     const viewerId = req.user._id;
//     const { id: profileId } = req.params;

//     if (viewerId.toString() === profileId) {
//       return res.status(400).json({ success: false, message: "Cannot view your own profile" });
//     }

//     const view = await ProfileView.findOneAndUpdate(
//       { viewer: viewerId, viewedProfile: profileId },
//       { viewedAt: new Date() },
//       { upsert: true, new: true }
//     );

//     res.status(200).json({ success: true, message: "Profile marked as viewed", view });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// const alreadyNotified = await Notification.findOne({
//   user: profile.userId,
//   sender: viewerId,
//   type: "PROFILE_VIEW",
//   createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
// });

// if (!alreadyNotified) {
//   await Notification.create(...);
// }


// export const markProfileViewed = async (req, res) => {
//   try {
//     const viewerId = req.user._id;
//     const { id: profileId } = req.params;

//     if (viewerId.toString() === profileId) {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot view your own profile",
//       });
//     }

//     // Save / update view
//     const view = await ProfileView.findOneAndUpdate(
//       { viewer: viewerId, viewedProfile: profileId },
//       { viewedAt: new Date() },
//       { upsert: true, new: true }
//     );

//     // Get profile owner (userId)
//     const profile = await Profile.findById(profileId).select("userId name");

//     if (profile) {
//       // Create notification (only once per day optional)
//       await Notification.create({
//         user: profile.userId,      // who will receive notification
//         type: "PROFILE_VIEW",
//         sender: viewerId,
//         profile: profileId,
//         message: "Someone viewed your profile",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Profile marked as viewed",
//       view,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const markProfileViewed = async (req, res) => {
  try {
    const viewerId = req.user._id;
    const { id: profileId } = req.params;

    if (viewerId.toString() === profileId) {
      return res.status(400).json({
        success: false,
        message: "Cannot view your own profile",
      });
    }

    // Save / update view tracking
    const view = await ProfileView.findOneAndUpdate(
      { viewer: viewerId, viewedProfile: profileId },
      { viewedAt: new Date() },
      { upsert: true, new: true }
    );

    // get receiver profile
    const profile = await Profile.findById(profileId).select("userId name");

    // get sender profile (VERY IMPORTANT)
    const senderProfile = await Profile.findOne({ userId: viewerId }).select("_id");

    if (profile && senderProfile) {
      // ✅ UPSERT notification (no duplicates)
      await Notification.findOneAndUpdate(
        {
          user: profile.userId,      // receiver
          sender: viewerId,         // sender user
          type: "PROFILE_VIEW"
        },
        {
          $set: {
            senderProfile: senderProfile._id,
            message: "Someone viewed your profile",
            isRead: false,
            updatedAt: new Date()
          },
          $inc: { viewCount: 1 }
        },
        {
          upsert: true,
          new: true
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile marked as viewed",
      view,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// export const getViewedProfiles = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const views = await ProfileView.find({ viewer: userId })
//       .sort({ viewedAt: -1 })
//       .populate("viewedProfile");

//     const profiles = views.map(v => v.viewedProfile);

//     res.status(200).json({
//       success: true,
//       results: profiles.length,
//       profiles
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


export const getViewedProfiles = async (req, res) => {
  try {
    const userId = req.user._id;

    const views = await ProfileView.find({
      viewer: userId
    })
      .sort({ viewedAt: -1 })
      .populate({
        path: "viewedProfile",
        match: { userId: { $ne: userId } }, // ✅ exclude self
        select: "name photos location age profession" // only needed fields
      })
      .lean();

    // remove nulls (if match filtered or profile deleted)
    const profiles = views
      .map(v => v.viewedProfile)
      .filter(Boolean);

    res.status(200).json({
      success: true,
      results: profiles.length,
      profiles
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getWhoViewedMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const views = await ProfileView.find({ viewedProfile: userId })
      .sort({ viewedAt: -1 })
      .populate("viewer");

    const users = views.map(v => v.viewer);

    res.status(200).json({
      success: true,
      results: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
