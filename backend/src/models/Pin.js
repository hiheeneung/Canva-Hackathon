import mongoose from 'mongoose';

const pinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: String,
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  description: String,
  image: String,
  placeId: String, // Google Places API place_id
  category: String, // e.g., 'restaurant', 'attraction', 'hotel'
  rating: Number,
  priceLevel: Number,
  website: String,
  phoneNumber: String,
  types: [String], // Google Places types
  businessStatus: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  city: String,
  country: String,
  date: {
    type: Date,
    default: Date.now
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
pinSchema.index({ user: 1, date: 1 });
pinSchema.index({ user: 1, city: 1, date: 1 });
pinSchema.index({ user: 1, isUsed: 1 });
pinSchema.index({ coordinates: '2dsphere' }); // Geospatial index

export default mongoose.model('Pin', pinSchema);
