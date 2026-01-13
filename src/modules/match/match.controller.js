import Profile from "../profile/profile.model.js";
import PartnerPreference from "./PartnerPreference.model.js";

export const getMatchesss = async (req, res) => {
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


export const getMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    const pref = await PartnerPreference.findOne({ userId });
    const userProfile = await Profile.findOne({ userId });

    if (!userProfile) {
      return res.json({ success: true, matches: [] });
    }

    // ---------------- AGE RANGE ----------------
    let minDOB = null;
    let maxDOB = null;

    if (pref?.ageTo) {
      minDOB = new Date();
      minDOB.setFullYear(minDOB.getFullYear() - pref.ageTo);
    }

    if (pref?.ageFrom) {
      maxDOB = new Date();
      maxDOB.setFullYear(maxDOB.getFullYear() - pref.ageFrom);
    }

    // ---------------- BASE QUERY (VERY LOOSE) ----------------
    const query = {
      userId: { $ne: userId },
      isVisible: true,
      gender: userProfile.gender === "male" ? "female" : "male",
    };

    if (minDOB || maxDOB) {
      query.dob = {};
      if (minDOB) query.dob.$gte = minDOB;
      if (maxDOB) query.dob.$lte = maxDOB;
    }

    const profiles = await Profile.find(query).limit(100);

    // ---------------- MATCH LOGIC ----------------
    const matches = profiles.map((profile) => {
      let score = 0;
      let total = 0;
      const matchedFields = [];
      const notMatchedFields = [];

      const check = (condition, field) => {
        total++;
        if (condition) {
          score++;
          matchedFields.push(field);
        } else {
          notMatchedFields.push(field);
        }
      };

      if (pref?.maritalStatus?.length)
        check(pref.maritalStatus.includes(profile.maritalStatus), "maritalStatus");

      if (pref?.religion)
        check(pref.religion === profile.religion, "religion");

      if (pref?.caste)
        check(pref.caste === profile.caste, "caste");

      if (pref?.motherTongue)
        check(pref.motherTongue === profile.motherTongue, "motherTongue");

      if (pref?.educationDetails?.length)
        check(pref.educationDetails.includes(profile.educationDetails), "education");

      if (pref?.employmentType?.length)
        check(pref.employmentType.includes(profile.employmentType), "employment");

      if (pref?.preferredCity?.length)
        check(pref.preferredCity.includes(profile.location || profile.city), "city");

      // Age check
      if (profile.dob && (pref?.ageFrom || pref?.ageTo)) {
        const age = new Date().getFullYear() - new Date(profile.dob).getFullYear();
        check(
          (!pref.ageFrom || age >= pref.ageFrom) &&
          (!pref.ageTo || age <= pref.ageTo),
          "age"
        );
      }

      const matchPercent =
        total > 0 ? Math.round((score / total) * 100) : 20; // default 20%

      return {
        ...profile.toObject(),
        matchPercent,
        matchedFields,
        notMatchedFields,
      };
    });

    // Sort best matches first
    matches.sort((a, b) => b.matchPercent - a.matchPercent);

    res.json({
      success: true,
      count: matches.length,
      matches,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
