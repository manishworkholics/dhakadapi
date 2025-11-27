import SuccessStory from "./SuccessStory.model.js";

export const createStoryService = async (payload) => {
  const story = await SuccessStory.create(payload);
  return story;
};

export const listStoriesService = async (limit = 20) => {
  const stories = await SuccessStory.find().sort({ createdAt: -1 }).limit(Number(limit)).lean();
  return stories;
};

export const getStoryByIdService = async (id) => {
  const story = await SuccessStory.findById(id);
  return story;
};

export const deleteStoryService = async (id) => {
  await SuccessStory.findByIdAndDelete(id);
  return true;
};
