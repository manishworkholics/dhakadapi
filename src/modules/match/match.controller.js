import Profile from "../profile/profile.model.js";
import PartnerPreference from "./PartnerPreference.model.js";

export const getMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    const pref = await PartnerPreference.findOne({ userId });
    if (!pref) {
      return res.json({
        success: true,
        matches: [],
        message: "No partner preferences set",
      });
    }

    const userProfile = await Profile.findOne({ userId });
    if (!userProfile) {
      return res.json({ success: true, matches: [] });
    }

    const minDOB = pref.ageTo
      ? new Date(new Date().setFullYear(new Date().getFullYear() - pref.ageTo))
      : null;

    const maxDOB = pref.ageFrom
      ? new Date(new Date().setFullYear(new Date().getFullYear() - pref.ageFrom))
      : null;

    const query = {
      userId: { $ne: userId },
      isVisible: true,
      gender: userProfile.gender === "Male" ? "Female" : "Male",
    };

    // Age
    if (minDOB || maxDOB) {
      query.dob = {};
      if (minDOB) query.dob.$gte = minDOB;
      if (maxDOB) query.dob.$lte = maxDOB;
    }

    // Height
    if (pref.heightFrom || pref.heightTo) {
      query.height = {};
      if (pref.heightFrom) query.height.$gte = pref.heightFrom;
      if (pref.heightTo) query.height.$lte = pref.heightTo;
    }

    // Marital Status
    if (pref.maritalStatus?.length) {
      query.maritalStatus = { $in: pref.maritalStatus };
    }

    if (pref.religion) query.religion = pref.religion;
    if (pref.caste) query.caste = pref.caste;
    if (pref.motherTongue) query.motherTongue = pref.motherTongue;

    if (pref.educationDetails?.length) {
      query.educationDetails = { $in: pref.educationDetails };
    }

    if (pref.employmentType?.length) {
      query.employmentType = { $in: pref.employmentType };
    }

    if (pref.preferredCity?.length) {
      query.location = { $in: pref.preferredCity };
    }

    const matches = await Profile.find(query)
      .select("-viewedBy")
      .limit(50);

    res.json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
