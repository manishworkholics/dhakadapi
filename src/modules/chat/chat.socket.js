import Message from "../chat/Message.model.js";
import ChatRoom from "../chat/ChatRoom.model.js";

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔥 User connected:", socket.id);

    // ================= JOIN ROOM =================
    socket.on("joinRoom", ({ chatRoomId }) => {
      socket.join(chatRoomId);
    });

    // ================= SEND MESSAGE =================
    socket.on("sendMessage", async (data) => {
      try {
        const { chatRoomId, senderId, message } = data;

        const newMessage = await Message.create({
          chatRoom: chatRoomId,
          sender: senderId,
          message,
          seenBy: [senderId], // sender has seen
        });

        await ChatRoom.findByIdAndUpdate(chatRoomId, {
          lastMessage: newMessage._id,
        });

        const populatedMessage = await newMessage.populate(
          "sender",
          "name"
        );

        io.to(chatRoomId).emit("receiveMessage", populatedMessage);

      } catch (err) {
        console.log("❌ sendMessage error:", err.message);
      }
    });

    // ================= MARK MESSAGES AS SEEN =================
    socket.on("markSeen", async ({ chatRoomId, userId }) => {
      try {
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

        // 🔥 Notify all users in room
        io.to(chatRoomId).emit("messagesSeen", {
          chatRoomId,
          seenBy: userId,
        });

      } catch (err) {
        console.log("❌ markSeen error:", err.message);
      }
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

export default chatSocket;

