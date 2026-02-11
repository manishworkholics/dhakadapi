import Profile from "../profile/profile.model.js";
import PartnerPreference from "./PartnerPreference.model.js";



import UserPlan from "../plan/UserPlan.model.js";
import User from "../auth/auth.model.js";


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


export const getSingleMatchProfile = async (req, res) => {
  try {
    const viewerId = req.user.id;
    const { id } = req.params;

    const pref = await PartnerPreference.findOne({ userId: viewerId });
    const userProfile = await Profile.findOne({ userId: viewerId });
    const profile = await Profile.findById(id).lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    /* ================= GET PROFILE USER ================= */
    const profileUser = await User.findById(profile.userId)
      .select("phone email")
      .lean();

    /* ================= PREMIUM CHECK ================= */
    let hasPremiumAccess = false;

    const activePlan = await UserPlan.findOne({
      user: viewerId,
      status: "active",
      endDate: { $gt: new Date() },
    });

    hasPremiumAccess = !!activePlan;

    /* ================= PHONE / EMAIL CONTROL ================= */
    if (hasPremiumAccess && profileUser) {
      profile.phone = profileUser.phone;
      profile.email = profileUser.email;
    } else {
      profile.phone = "🔒 Upgrade to premium to view contact details";
      profile.email = "🔒 Upgrade to premium to view contact details";
    }

    /* ================= PHOTO CONTROL ================= */
    if (!hasPremiumAccess && Array.isArray(profile.photos)) {
      profile.photos = profile.photos.length > 0 ? [profile.photos[0]] : [];
    }

    /* ================= MATCH LOGIC ================= */
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

    if (profile.dob && (pref?.ageFrom || pref?.ageTo)) {
      const age =
        new Date().getFullYear() - new Date(profile.dob).getFullYear();

      check(
        (!pref.ageFrom || age >= pref.ageFrom) &&
        (!pref.ageTo || age <= pref.ageTo),
        "age"
      );
    }

    const matchPercent =
      total > 0 ? Math.round((score / total) * 100) : 20;

    /* ================= PREFERENCE UI ================= */
    const preferenceMatches = [
      {
        field: "Age",
        value: `${pref?.ageFrom || ""} to ${pref?.ageTo || ""}`,
        matched: matchedFields.includes("age"),
      },
      {
        field: "Marital Status",
        value: profile.maritalStatus,
        matched: matchedFields.includes("maritalStatus"),
      },
      {
        field: "Religion / Community",
        value: `${profile.religion} ${profile.caste}`,
        matched: matchedFields.includes("religion"),
      },
      {
        field: "Mother Tongue",
        value: profile.motherTongue,
        matched: matchedFields.includes("motherTongue"),
      },
      {
        field: "City",
        value: profile.location,
        matched: matchedFields.includes("city"),
      },
      {
        field: "Education",
        value: profile.educationDetails,
        matched: matchedFields.includes("education"),
      },
    ];

    /* ================= COMMON POINTS ================= */
    const commonPoints = [];

    if (userProfile?.educationDetails === profile.educationDetails) {
      commonPoints.push("Both have similar education background");
    }

    if (userProfile?.motherTongue === profile.motherTongue) {
      commonPoints.push("Both belong to same mother tongue");
    }

    if (userProfile?.religion === profile.religion) {
      commonPoints.push("Both share same religion");
    }

    res.json({
      success: true,
      profile,
      hasPremiumAccess,
      compatibility: {
        matchPercent,
        matchedCount: score,
        totalChecks: total,
        preferenceMatches,
        commonPoints,
        matchedFields,
        notMatchedFields,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

