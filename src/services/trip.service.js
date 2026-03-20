import Trip from "../models/trip.model.js";
import {
  generateItinerary,
  estimateBudget,
  suggestHotels,
  suggestActivityAI,
  optimizeBudgetAI,
} from "./ai.service.js";

export const createTrip = async (userId, data) => {
  const itinerary = await generateItinerary(data);  
  const budget = await estimateBudget(data);        
  const hotels = await suggestHotels(data); 

  const trip =  await Trip.create({
    userId,
    ...data,
    itinerary,
    budget,
    hotels,
  });
  return {
    code:200,
    message:"Trip generated successfully",
    trip
  }
};

export const getTrips = async (userId) => {
  const trip =  await Trip.find({ userId });
  return {
    code:200,
    message:"Trip retrieved successfully",
    trip
  }
};

export const suggestActivity = async (data) => {
  const activity =  await suggestActivityAI(data);
  return {
    code:200,
    message:"Activity suggestion fetched successfully",
    activity
  }
};

export const optimizeBudget = async (tripId, level) => {
  const trip = await Trip.findById(tripId);

  const updatedPlan = await optimizeBudgetAI(trip, level);

  trip.itinerary = updatedPlan.itinerary;
  trip.budget = updatedPlan.budget;

  await trip.save();

  return {
    code:200,
    message:"Budget Optimized successfully",
    trip
  };
};