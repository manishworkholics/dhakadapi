// import dotenv from "dotenv";
// import app from "./app.js";
// import connectDB from "./config/db.js";

// dotenv.config();

// const PORT = process.env.PORT || 5000;

// connectDB();

// app.listen(PORT, () => {
//   console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });


import { app, server } from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
// import { assignSuperAdminToExistingAdmin } from "./modules/admin/bootstrapSuperAdmin.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

// await assignSuperAdminToExistingAdmin();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
