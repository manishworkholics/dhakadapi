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

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
