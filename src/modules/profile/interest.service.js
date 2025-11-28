import Interest from "./Interest.model.js";

export const createInterestService = async (senderId, receiverId) => {
  const exists = await Interest.findOne({ senderId, receiverId });
  if (exists) throw new Error("Interest already sent");
  const interest = await Interest.create({ senderId, receiverId });
  return interest;
};

export const getMyInterestsService = async (senderId) => {
  const items = await Interest.find({ senderId }).populate("receiverId");
  return items;
};

export const cancelInterestService = async (interestId, userId) => {
  const interest = await Interest.findById(interestId);
  if (!interest) throw new Error("Interest not found");
  if (String(interest.senderId) !== String(userId)) throw new Error("Not authorized");
  await Interest.findByIdAndDelete(interestId);
  return true;
};

export const checkInterestService = async (senderId, receiverId) => {
  const item = await Interest.findOne({ senderId, receiverId });
  return item;
};
