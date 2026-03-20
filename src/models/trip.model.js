import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,

  destination: String,
  days: Number,
  budgetType: String,
  interests: String,

  itinerary: [
    {
      day: Number,
      activities: [String],
    },
  ],

  budget: {
    flights: Number,
    hotel: Number,
    food: Number,
    activities: Number,
    total: Number,
  },

  hotels: [String],
});

export default mongoose.model("Trip", tripSchema);