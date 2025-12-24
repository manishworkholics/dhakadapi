import ChatRoom from "../chat/ChatRoom.model.js";
import ChatMessage from "../chat/Message.model.js";
import Profile from "../profile/profile.model.js"


export const chatNow = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    // ❌ Prevent self chat
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot chat with yourself",
      });
    }

    // 🔍 Check existing chat (active OR pending)
    const existingChat = await ChatRoom.findOne({
      participants: { $all: [senderId, receiverId] },
      status: { $ne: "rejected" },
    });

    if (existingChat) {
      return res.json({
        success: true,
        chat: existingChat,
        message:
          existingChat.status === "pending"
            ? "Chat request already sent"
            : "Chat already exists",
      });
    }

    // ✅ Create pending chat request
    const chatRoom = await ChatRoom.create({
      participants: [senderId, receiverId],
      requestedBy: senderId, // 🔥 VERY IMPORTANT
      status: "pending",     // pending | active | rejected
    });

    res.json({
      success: true,
      chat: chatRoom,
      message: "Chat request sent successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const getOrCreateChatRoom = async (req, res) => {
  try {
    const userId = req.user._id;
    const { receiverId } = req.body;

    let room = await ChatRoom.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (!room) {
      room = await ChatRoom.create({
        participants: [userId, receiverId],
      });
    }

    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getChatListss = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await ChatRoom.find({
      participants: userId,
    })
      .populate("participants", "name photos")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name" },
      })
      .sort({ updatedAt: -1 });

    res.json({ success: true, chats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getChatList = async (req, res) => {
  try {
    const userId = req.user._id;

    let chats = await ChatRoom.find({
      participants: userId,
    })
      .populate("participants", "name")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name" },
      })
      .sort({ updatedAt: -1 })
      .lean(); // IMPORTANT

    // collect participant userIds
    const userIds = chats.flatMap(chat =>
      chat.participants.map(p => p._id)
    );

    // fetch profiles
    const profiles = await Profile.find(
      { userId: { $in: userIds } },
      { userId: 1, photos: 1 }
    ).lean();

    // map profiles by userId
    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.userId.toString()] = p;
    });

    // attach photo to participants
    chats = chats.map(chat => ({
      ...chat,
      participants: chat.participants.map(p => ({
        _id: p._id,
        name: p.name,
        photo: profileMap[p._id.toString()]?.photos?.[0] || null,
      })),
    }));

    res.json({ success: true, chats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getChatListssss = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await ChatRoom.aggregate([
      { $match: { participants: userId } },

      // 🔹 populate participants (users)
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
        },
      },

      // 🔹 populate profiles
      {
        $lookup: {
          from: "profiles",
          localField: "participants._id",
          foreignField: "userId",
          as: "profiles",
        },
      },

      // 🔹 populate lastMessage
      {
        $lookup: {
          from: "chatmessages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🔹 populate lastMessage.sender
      {
        $lookup: {
          from: "users",
          localField: "lastMessage.sender",
          foreignField: "_id",
          as: "lastMessage.sender",
        },
      },
      {
        $unwind: {
          path: "$lastMessage.sender",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🔹 merge photo into participants
      {
        $addFields: {
          participants: {
            $map: {
              input: "$participants",
              as: "user",
              in: {
                _id: "$$user._id",
                name: "$$user.name",
                photo: {
                  $let: {
                    vars: {
                      profile: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$profiles",
                              as: "p",
                              cond: {
                                $eq: ["$$p.userId", "$$user._id"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $arrayElemAt: ["$$profile.photos", 0] },
                  },
                },
              },
            },
          },
        },
      },

      { $sort: { updatedAt: -1 } },

      // 🔹 keep response EXACTLY SAME
      {
        $project: {
          participants: 1,
          lastMessage: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.json({ success: true, chats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




// ---------------- GET CHAT MESSAGES ----------------
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roomId } = req.params;

    const room = await ChatRoom.findById(roomId);
    if (!room || !room.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const messages = await ChatMessage.find({ chatRoom: roomId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { chatRoomId, message } = req.body;

    const chat = await ChatRoom.findById(chatRoomId);

    if (!chat || chat.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Chat not active yet",
      });
    }

    if (!chatRoomId || !message) {
      return res.status(400).json({
        success: false,
        message: "chatRoomId and message are required",
      });
    }

    const room = await ChatRoom.findById(chatRoomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      });
    }

    const isParticipant = room.participants.some(
      (id) => id.toString() === senderId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to send message in this room",
      });
    }

    const newMessage = await ChatMessage.create({
      chatRoom: chatRoomId,
      sender: senderId,
      message,
      seenBy: [senderId],
    });

    await ChatRoom.findByIdAndUpdate(chatRoomId, {
      lastMessage: newMessage._id,
    });

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




// ================= CHAT LIST =================
export const getChatLists = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Find chat rooms of user
    const chatRooms = await ChatRoom.find({
      participants: userId,
    })
      .populate("participants", "_id")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name" },
      })
      .sort({ updatedAt: -1 });

    // 2️⃣ Format response
    const chatList = await Promise.all(
      chatRooms.map(async (room) => {
        // Get other user
        const otherUser = room.participants.find(
          (p) => p._id.toString() !== userId.toString()
        );

        // Get profile
        const profile = await Profile.findOne({ userId: otherUser._id })
          .select("name photos location occupation");

        // Count unread messages
        const unreadCount = await Message.countDocuments({
          chatRoom: room._id,
          sender: { $ne: userId },
          seenBy: { $ne: userId },
        });

        return {
          chatRoomId: room._id,
          user: profile,
          lastMessage: room.lastMessage?.message || "",
          lastMessageTime: room.lastMessage?.createdAt || null,
          unreadCount,
        };
      })
    );

    res.json({ success: true, chats: chatList });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ================= MARK MESSAGES AS SEEN =================
export const markMessagesAsSeen = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatRoomId } = req.params;

    const room = await ChatRoom.findById(chatRoomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      });
    }

    const isParticipant = room.participants.some(
      (id) => id.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    await ChatMessage.updateMany(
      {
        chatRoom: chatRoomId,
        sender: { $ne: userId },
        seenBy: { $ne: userId },
      },
      {
        $addToSet: { seenBy: userId },
      }
    );

    res.json({ success: true, message: "Messages marked as seen" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getChatRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ChatRoom.find({
      participants: userId,
      requestedBy: { $ne: userId }, // ❗ receiver side only
      status: "pending",
    })
      .populate("participants", "name")
      .populate("requestedBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const respondToChatRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatRoomId, action } = req.body; // action = "accept" | "reject"

    if (!chatRoomId || !action) {
      return res.status(400).json({
        success: false,
        message: "chatRoomId and action are required",
      });
    }

    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      });
    }

    // 🔒 Only receiver can accept/reject
    if (chatRoom.requestedBy.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot respond to your own chat request",
      });
    }

    if (chatRoom.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Chat request already handled",
      });
    }

    if (action === "accept") {
      chatRoom.status = "active";
    }

    if (action === "reject") {
      chatRoom.status = "rejected";
    }

    await chatRoom.save();

    res.json({
      success: true,
      message:
        action === "accept"
          ? "Chat request accepted"
          : "Chat request rejected",
      chat: chatRoom,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
