import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
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
  order: Number
});

const routeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  city: {
    type: String,
    trim: true,
    maxlength: 50
  },
  country: {
    type: String,
    trim: true,
    maxlength: 50
  },
  locations: [locationSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  estimatedDuration: {
    type: Number, // in minutes
    min: 0
  },
  distance: {
    type: Number, // in kilometers
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
routeSchema.index({ user: 1 });
routeSchema.index({ isPublic: 1 });
routeSchema.index({ city: 1, country: 1 });
routeSchema.index({ tags: 1 });
routeSchema.index({ createdAt: -1 });

// Virtual for likes count
routeSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for favorites count
routeSchema.virtual('favoritesCount').get(function() {
  return this.favorites.length;
});

// Ensure virtual fields are serialized
routeSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Route', routeSchema);
