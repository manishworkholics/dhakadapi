import Notification from "../notification/notification.model.js";
import Profile from "../profile/profile.model.js";

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      user: userId,
      sender: { $ne: userId }
    })
      .sort({ createdAt: -1 })

      // populate sender user
      .populate("sender", "name")

      // populate sender profile directly
      .populate({
        path: "profile",
        select: "name photos userId",
      })

      .lean();

    const formatted = await Promise.all(
      notifications.map(async (n) => {
        const senderProfile = await Profile.findOne({ userId: n.sender._id });

        return {
          ...n,
          senderProfileId: senderProfile?._id,
          senderPhoto: senderProfile?.photos?.[0]
        };
      })
    );


    res.status(200).json({
      success: true,
      results: formatted.length,
      notifications: formatted,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

