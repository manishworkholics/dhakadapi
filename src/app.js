import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));


import authRoutes from "./modules/auth/auth.routes.js";
app.use("/api/auth", authRoutes);

import profileRoutes from "./modules/profile/profile.routes.js";
app.use("/api/profile", profileRoutes);

import profileUploadRoutes from "./modules/profile/profile.upload.routes.js";
app.use("/api/upload", profileUploadRoutes);

import adminRoutes from "./modules/admin/admin.routes.js";
app.use("/api/admin", adminRoutes);

import adminUserRoutes from "./modules/admin/admin.user.routes.js";
app.use("/api/admin", adminUserRoutes);

import interestRoutes from "./modules/profile/interest.routes.js";
app.use("/api/interestssss", interestRoutes);

import featuredRoutes from "./modules/profile/featured.routes.js";
app.use("/api/featured", featuredRoutes);

import successRoutes from "./modules/profile/success.routes.js";
app.use("/api/success", successRoutes);

import viewedRoutes from "./modules/profile/profileview.routes.js";
app.use("/api/viewed", viewedRoutes);

import sendinterestRoutes from "./modules/intrest/intrest.routes.js";
app.use("/api/interest", sendinterestRoutes);

import shortlistRoutes from "./modules/shortlist/shortlist.routes.js";
app.use("/api/shortlist", shortlistRoutes);


import uploadRoutes from "./modules/profile/upload.routes.js";
app.use("/api", uploadRoutes);


import adminProfileRoutes from "./modules/admin/admin.profile.routes.js";
app.use("/api/admin", adminProfileRoutes);

import adminDashboardRoutes from "./modules/admin/admin.dashboard.routes.js";
app.use("/api/admin", adminDashboardRoutes);

import locationRoutes from "./modules/location/location.routes.js";
app.use("/api/location", locationRoutes);


import planRoutes from "./modules/plan/plan.routes.js";
app.use("/api/plan", planRoutes);

import contactRoutes from "./modules/contactus/contact.routes.js";
app.use("/api/contact", contactRoutes);


import chatRoutes from "./modules/chat/chat.routes.js";
app.use("/api/chat", chatRoutes);


import PartnerPreferenceRoutes from "./modules/match/partnerPreference.routes.js";
app.use("/api/partner-preference", PartnerPreferenceRoutes);

import MatchesRoutes from "./modules/match/match.routes.js";
app.use("/api/matches", MatchesRoutes);

import chatSocket from "./modules/chat/chat.socket.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// chatSocket(io);

// export { io };

const onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
  });

  socket.on("sendMessage", async (data) => {
    const { chatRoomId, senderId, receiverId, message } = data;

    // Emit to receiver if online
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", data);
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
    }
  });
});


app.get("/", (req, res) => {
  res.send("Dhakad Matrimony API is running...");
});

export { app, server };

