import express from "express";
import { getOrCreateChatRoom, getChatList, getMessages, sendMessage, getChatLists, markMessagesAsSeen, chatNow ,respondToChatRequest,getChatRequests} from "../chat/chat.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/now", protect, chatNow);
router.get("/request", protect, getChatRequests);
router.put("/respond", protect, respondToChatRequest);

router.post("/room", protect, getOrCreateChatRoom);
router.get("/list", protect, getChatList);
router.get("/lists", protect, getChatLists);
router.post("/messages/send", protect, sendMessage);
router.get("/messages/:roomId", protect, getMessages);
router.put("/seen/:chatRoomId", protect, markMessagesAsSeen);


export default router;
