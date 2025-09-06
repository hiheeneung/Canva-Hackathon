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
    category: String,
    pins: [PinSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Route", RouteSchema);
