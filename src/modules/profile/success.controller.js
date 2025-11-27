import {
  createStoryService,
  listStoriesService,
  getStoryByIdService,
  deleteStoryService,
} from "./success.service.js";

export const createStory = async (req, res) => {
  try {
    const payload = req.body; // { name, partnerName, story, image }
    const story = await createStoryService(payload);
    res.status(201).json({ success: true, story });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const stories = await listStoriesService(limit);
    res.status(200).json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await getStoryByIdService(id);
    if (!story) return res.status(404).json({ success: false, message: "Story not found" });
    res.status(200).json({ success: true, story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteStoryService(id);
    res.status(200).json({ success: true, message: "Story deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
