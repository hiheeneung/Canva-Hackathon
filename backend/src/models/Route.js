import mongoose from "mongoose";

const PinSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  note: String,
});

const RouteSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "guest" },
    name: String,
    city: String,
    country: String,
    category: String,
    pins: [PinSchema],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }], // Array of user IDs who liked this route
  },
  { timestamps: true }
);

export default mongoose.model("Route", RouteSchema);
