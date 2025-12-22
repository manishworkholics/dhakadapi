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

import chatRoutes from "./modules/chat/chat.routes.js";
import chatSocket from "./modules/chat/chat.socket.js";
app.use("/api/chat", chatRoutes);


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

chatSocket(io);

export { io };


app.get("/", (req, res) => {
  res.send("Dhakad Matrimony API is running...");
});

export default app;
