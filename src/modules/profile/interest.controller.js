import {
  createInterestService,
  getMyInterestsService,
  cancelInterestService,
  checkInterestService,
} from "./interest.service.js";

export const sendInterest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ success: false, message: "receiverId required" });

    const interest = await createInterestService(senderId, receiverId);
    res.status(201).json({ success: true, message: "Interest Sent", data: interest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyInterests = async (req, res) => {
  try {
    const senderId = req.user._id;
    const interests = await getMyInterestsService(senderId);
    res.status(200).json({ success: true, interests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelInterest = async (req, res) => {
  try {
    const interestId = req.params.id;
    const userId = req.user._id;
    await cancelInterestService(interestId, userId);
    res.status(200).json({ success: true, message: "Interest cancelled" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkInterest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.query;
    if (!receiverId) return res.status(400).json({ success: false, message: "receiverId required" });
    const item = await checkInterestService(senderId, receiverId);
    res.status(200).json({ success: true, exists: !!item, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
