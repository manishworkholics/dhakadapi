import PartnerPreference from "./PartnerPreference.model.js";

export const savePartnerPreference = async (req, res) => {
  try {
    const userId = req.user.id;

    const preference = await PartnerPreference.findOneAndUpdate(
      { userId },
      { ...req.body, userId },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Partner preference saved",
      preference,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyPartnerPreference = async (req, res) => {
  try {
    const userId = req.user.id;

    const preference = await PartnerPreference.findOne({ userId });

    if (!preference) {
      return res.json({
        success: true,
        preference: null,
        message: "No partner preference found",
      });
    }

    res.json({
      success: true,
      preference,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const deletePartnerPreference = async (req, res) => {
  try {
    const userId = req.user.id;

    await PartnerPreference.findOneAndDelete({ userId });

    res.json({
      success: true,
      message: "Partner preference deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
