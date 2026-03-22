import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.route.js";
import tripRoutes from "./src/routes/trip.route.js";

dotenv.config();

const app = express();

// app.use(cors());

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://traveller-frontend-virid.vercel.app" // 🔥 replace with your actual URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

export default app;