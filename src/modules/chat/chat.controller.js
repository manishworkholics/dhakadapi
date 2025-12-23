import ChatRoom from "../chat/ChatRoom.model.js";
import ChatMessage from "../chat/Message.model.js";
import Profile from "../profile/profile.model.js"

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

export const getChatList = async (req, res) => {
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

    await Message.updateMany(
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
