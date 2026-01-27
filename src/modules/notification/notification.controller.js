import Notification from "../notification/notification.model.js";

export const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("sender", "name")
            .populate("profile", "name photos");

        res.status(200).json({
            success: true,
            results: notifications.length,
            notifications,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
