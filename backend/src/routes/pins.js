import express from 'express';
import mongoose from 'mongoose';
import Pin from '../models/Pin.js';
import Route from '../models/Route.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Drop a pin (save location)
router.post('/drop', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      address,
      coordinates,
      description,
      image,
      placeId,
      category,
      rating,
      priceLevel,
      website,
      phoneNumber,
      types = [],
      city,
      country
    } = req.body;

    if (!name || !coordinates || !coordinates.lat || !coordinates.lng) {
      return res.status(400).json({ error: 'Name and coordinates are required' });
    }

    const newPin = new Pin({
      name,
      address,
      coordinates: {
        lat: parseFloat(coordinates.lat),
        lng: parseFloat(coordinates.lng)
      },
      description,
      image,
      placeId,
      category,
      rating: rating ? parseFloat(rating) : undefined,
      priceLevel: priceLevel ? parseInt(priceLevel) : undefined,
      website,
      phoneNumber,
      types,
      city,
      country,
      user: req.user.id,
      date: new Date()
    });

    await newPin.save();

    res.status(201).json({
      message: 'Pin dropped successfully',
      pin: newPin
    });
  } catch (error) {
    console.error('Drop pin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's pins for a specific date and city
router.get('/daily/:date/:city', authenticateToken, async (req, res) => {
  try {
    const { date, city } = req.params;
    const userId = req.user.id;

    // Parse date (expecting YYYY-MM-DD format)
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const pins = await Pin.find({
      user: userId,
      city: city,
      date: {
        $gte: startDate,
        $lt: endDate
      },
      isUsed: false
    }).sort({ createdAt: 1 });

    res.json({
      pins,
      count: pins.length,
      date,
      city
    });
  } catch (error) {
    console.error('Get daily pins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's pins grouped by date and city
router.get('/grouped', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 30 } = req.query;

    const pins = await Pin.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId), isUsed: false } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            city: '$city'
          },
          pins: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      groupedPins: pins,
      total: pins.length
    });
  } catch (error) {
    console.error('Get grouped pins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create route from pins
router.post('/create-route', authenticateToken, async (req, res) => {
  try {
    const {
      pinIds,
      title,
      description,
      category = 'other',
      difficulty = 'easy',
      estimatedDuration,
      distance,
      tags = [],
      isPublic = true
    } = req.body;

    if (!pinIds || !Array.isArray(pinIds) || pinIds.length === 0) {
      return res.status(400).json({ error: 'Pin IDs are required' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Get pins and verify they belong to the user
    const pins = await Pin.find({
      _id: { $in: pinIds },
      user: req.user.id,
      isUsed: false
    });

    if (pins.length !== pinIds.length) {
      return res.status(400).json({ error: 'Some pins not found or already used' });
    }

    // Check if all pins are from the same city and date
    const firstPin = pins[0];
    const sameCity = pins.every(pin => pin.city === firstPin.city);
    const sameDate = pins.every(pin => {
      const pinDate = new Date(pin.date).toDateString();
      const firstPinDate = new Date(firstPin.date).toDateString();
      return pinDate === firstPinDate;
    });

    if (!sameCity) {
      return res.status(400).json({ error: 'All pins must be from the same city' });
    }

    if (!sameDate) {
      return res.status(400).json({ error: 'All pins must be from the same date' });
    }

    // Create route
    const newRoute = new Route({
      title,
      description,
      city: firstPin.city,
      country: firstPin.country,
      pins: pins.map((pin, index) => ({
        name: pin.name,
        address: pin.address,
        coordinates: pin.coordinates,
        description: pin.description,
        image: pin.image,
        placeId: pin.placeId,
        category: pin.category,
        rating: pin.rating,
        priceLevel: pin.priceLevel,
        website: pin.website,
        phoneNumber: pin.phoneNumber,
        types: pin.types,
        order: index
      })),
      category,
      difficulty,
      estimatedDuration,
      distance,
      tags,
      user: req.user.id,
      isPublic
    });

    await newRoute.save();

    // Mark pins as used and link to route
    await Pin.updateMany(
      { _id: { $in: pinIds } },
      { 
        isUsed: true,
        routeId: newRoute._id
      }
    );

    await newRoute.populate('user', 'username email');

    res.status(201).json({
      message: 'Route created successfully from pins',
      route: newRoute,
      pinsUsed: pins.length
    });
  } catch (error) {
    console.error('Create route from pins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get nearby pins (for suggestions)
router.get('/nearby', authenticateToken, async (req, res) => {
  try {
    const { lat, lng, radius = 1000, limit = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const pins = await Pin.find({
      user: req.user.id,
      isUsed: false,
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).limit(parseInt(limit));

    res.json({
      pins,
      count: pins.length
    });
  } catch (error) {
    console.error('Get nearby pins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a pin
router.delete('/:pinId', authenticateToken, async (req, res) => {
  try {
    const { pinId } = req.params;

    const pin = await Pin.findOneAndDelete({
      _id: pinId,
      user: req.user.id,
      isUsed: false
    });

    if (!pin) {
      return res.status(404).json({ error: 'Pin not found or already used' });
    }

    res.json({ message: 'Pin deleted successfully' });
  } catch (error) {
    console.error('Delete pin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pin statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Pin.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalPins: { $sum: 1 },
          usedPins: { $sum: { $cond: ['$isUsed', 1, 0] } },
          unusedPins: { $sum: { $cond: ['$isUsed', 0, 1] } },
          cities: { $addToSet: '$city' },
          categories: { $addToSet: '$category' }
        }
      },
      {
        $project: {
          totalPins: 1,
          usedPins: 1,
          unusedPins: 1,
          cityCount: { $size: '$cities' },
          categoryCount: { $size: '$categories' }
        }
      }
    ]);

    res.json(stats[0] || {
      totalPins: 0,
      usedPins: 0,
      unusedPins: 0,
      cityCount: 0,
      categoryCount: 0
    });
  } catch (error) {
    console.error('Get pin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
