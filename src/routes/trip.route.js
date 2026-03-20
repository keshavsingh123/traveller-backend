import express from "express";
import { createTrip, getTrips, optimizeBudget, suggestActivity } from "../controllers/trip.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", protect, createTrip);
router.get("/", protect, getTrips);
router.post("/suggest-activity", protect, suggestActivity);
router.put("/optimize-budget/:id", protect, optimizeBudget);
export default router;