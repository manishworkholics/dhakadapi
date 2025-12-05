
import InterestRequest from "../intrest/interestRequest.model.js";
import Profile from "../profile/profile.model.js";


// -------------------- SEND INTEREST --------------------
export const sendInterestRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, message } = req.body;

    if (senderId.toString() === receiverId)
      return res.status(400).json({ success: false, message: "You cannot send request to yourself" });

    // Check duplicate request
    const existing = await InterestRequest.findOne({ sender: senderId, receiver: receiverId });
    if (existing)
      return res.status(400).json({ success: false, message: "Request already sent" });

    const newRequest = await InterestRequest.create({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    res.json({ success: true, message: "Interest Sent!", request: newRequest });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// -------------------- RECEIVED REQUESTS --------------------
export const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const requests = await InterestRequest.find({
      receiver: userId,
      status: status || "pending",
    })
      .populate("sender", "name email phone")
      .sort({ createdAt: -1 });

    // Attach sender profile details
    const formatted = await Promise.all(
      requests.map(async (item) => {
        const profile = await Profile.findOne({ userId: item.sender._id })
          .select("name location occupation dob photos religion education");

        return {
          ...item._doc,
          profile: profile || null,
        };
      })
    );

    res.json({ success: true, requests: formatted });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAcceptedRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await InterestRequest.find({
      receiver: userId,
      status: "accepted"
    })
      .populate("sender", "name email phone")
      .sort({ createdAt: -1 });

    const formatted = await Promise.all(
      requests.map(async (item) => {
        const profile = await Profile.findOne({ userId: item.sender._id })
          .select("name location occupation dob photos religion education");

        return {
          ...item._doc,
          profile: profile || null,
        };
      })
    );

    res.json({ success: true, requests: formatted });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getRejectedRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await InterestRequest.find({
      receiver: userId,
      status: "rejected"
    })
      .populate("sender", "name email phone")
      .sort({ createdAt: -1 });

    const formatted = await Promise.all(
      requests.map(async (item) => {
        const profile = await Profile.findOne({ userId: item.sender._id })
          .select("name location occupation dob photos religion education");

        return {
          ...item._doc,
          profile: profile || null,
        };
      })
    );

    res.json({ success: true, requests: formatted });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// -------------------- SENT REQUESTS --------------------
export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const requests = await InterestRequest.find({
      sender: userId,
      ...(status && { status }),
    })
      .populate("receiver", "name email phone")
      .sort({ createdAt: -1 });

    // Attach receiver profile
    const formatted = await Promise.all(
      requests.map(async (item) => {
        const profile = await Profile.findOne({ userId: item.receiver._id })
          .select("name location occupation dob photos religion education");

        return {
          ...item._doc,
          profile: profile || null,
        };
      })
    );

    res.json({ success: true, requests: formatted });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// -------------------- ACCEPT REQUEST --------------------
export const acceptRequest = async (req, res) => {
  try {
    const updated = await InterestRequest.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );

    res.json({ success: true, message: "Request Accepted", request: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// -------------------- REJECT REQUEST --------------------
export const rejectRequest = async (req, res) => {
  try {
    const updated = await InterestRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    res.json({ success: true, message: "Request Rejected", request: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// -------------------- CANCEL REQUEST (Only sender) --------------------
export const cancelRequest = async (req, res) => {
  try {
    const userId = req.user._id;

    const request = await InterestRequest.findOne({
      _id: req.params.id,
      sender: userId,
    });

    if (!request)
      return res.status(404).json({ success: false, message: "Not allowed to cancel" });

    await request.deleteOne();

    res.json({ success: true, message: "Request Cancelled" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


