import * as tripService from "../services/trip.service.js";

export const createTrip = async (req, res) => {
  try {
    const trip = await tripService.createTrip(req.user.userId, req.body);
    res.json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await tripService.getTrips(req.user.userId);
    res.json(trips);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const suggestActivity = async (req, res) => {
  try {
    const { destination, interest } = req.body;

    const activities = await tripService.suggestActivity({
      destination,
      interest,
    });

    res.json(activities);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const optimizeBudget = async (req, res) => {
  try {
    const { level } = req.body;

    const updated = await tripService.optimizeBudget(
      req.params.id,
      level
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};