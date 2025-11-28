import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// import routes (later we’ll add auth, profile, etc.)
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
import featuredRoutes from "./modules/profile/featured.routes.js";
import successRoutes from "./modules/profile/success.routes.js";

app.use("/api/interest", interestRoutes);
app.use("/api/featured", featuredRoutes);
app.use("/api/success", successRoutes);



import uploadRoutes from "./modules/profile/upload.routes.js";

app.use("/api", uploadRoutes);


import adminProfileRoutes from "./modules/admin/admin.profile.routes.js";
import adminDashboardRoutes from "./modules/admin/admin.dashboard.routes.js";

app.use("/api/admin", adminProfileRoutes);
app.use("/api/admin", adminDashboardRoutes);



app.get("/", (req, res) => {
  res.send("Dhakad Matrimony API is running...");
});

export default app;
