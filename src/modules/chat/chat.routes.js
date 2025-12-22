import express from "express";
import { getOrCreateChatRoom, getChatList, getMessages, sendMessage,getChatLists ,markMessagesAsSeen} from "../chat/chat.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/room", protect, getOrCreateChatRoom);
router.get("/list", protect, getChatList);
router.get("/lists", protect, getChatLists);
router.post("/messages/send", protect, sendMessage);
router.get("/messages/:roomId", protect, getMessages);
router.put("/seen/:chatRoomId",protect, markMessagesAsSeen);


export default router;
