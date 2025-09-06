import express from 'express';
import Route from '../models/Route.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { sort, country, city, category } = req.query;
    const userId = req.user?.id; // Optional: for authenticated users

    let query = { isPublic: true };

    // Apply filters
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    // Apply sorting
    let sortOption = { createdAt: -1 }; // default: latest
    switch (sort) {
      case 'latest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'likes':
        sortOption = { likesCount: -1, createdAt: -1 };
        break;
      case 'views':
        sortOption = { viewCount: -1, createdAt: -1 };
        break;
      case 'popular':
        sortOption = { likesCount: -1, viewCount: -1, createdAt: -1 };
        break;
    }

    const routes = await Route.find(query)
      .populate('user', 'username email')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Add favorite status for authenticated users
    if (userId) {
      routes.forEach(route => {
        route.isFavorited = route.favorites.includes(userId);
      });
    }

    const total = await Route.countDocuments(query);

    res.json({
      routes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, city, country } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const userId = req.user?.id; // Optional: for authenticated users

    let query = { isPublic: true };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    const routes = await Route.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Add favorite status for authenticated users
    if (userId) {
      routes.forEach(route => {
        route.isFavorited = route.favorites.includes(userId);
      });
    }

    const total = await Route.countDocuments(query);

    res.json({
      routes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Search routes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user?.id; // Optional: for authenticated users

    const routes = await Route.find({ isPublic: true })
      .populate('user', 'username email')
      .sort({ likesCount: -1, createdAt: -1 })
      .limit(limit);

    // Add favorite status for authenticated users
    if (userId) {
      routes.forEach(route => {
        route.isFavorited = route.favorites.includes(userId);
      });
    }

    res.json({ routes });
  } catch (error) {
    console.error('Get popular routes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Optional: for authenticated users

    const route = await Route.findOne({ _id: id, isPublic: true })
      .populate('user', 'username email');

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    // Add favorite status for authenticated users
    if (userId) {
      route.isFavorited = route.favorites.includes(userId);
    }

    res.json(route);
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      city, 
      country, 
      locations, 
      pins, 
      category = 'other',
      difficulty = 'easy',
      estimatedDuration,
      distance,
      tags = [],
      isPublic = true 
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newRoute = new Route({
      title,
      description,
      city,
      country,
      locations: locations || [],
      pins: pins || [],
      category,
      difficulty,
      estimatedDuration,
      distance,
      tags,
      user: req.user.id,
      isPublic
    });

    await newRoute.save();
    await newRoute.populate('user', 'username email');

    res.status(201).json(newRoute);
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, city, country, locations, isPublic } = req.body;

    const route = await Route.findOne({ _id: id, user: req.user.id });
    
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (locations !== undefined) updateData.locations = locations;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    const updatedRoute = await Route.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'username email');

    res.json(updatedRoute);
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findOneAndDelete({ _id: id, user: req.user.id });
    
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Like/Unlike route
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    if (route.likes.includes(userId)) {
      return res.status(400).json({ error: 'Route already liked' });
    }

    await Route.findByIdAndUpdate(id, {
      $addToSet: { likes: userId }
    });

    res.json({ message: 'Route liked successfully' });
  } catch (error) {
    console.error('Like route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    if (!route.likes.includes(userId)) {
      return res.status(400).json({ error: 'Route not liked' });
    }

    await Route.findByIdAndUpdate(id, {
      $pull: { likes: userId }
    });

    res.json({ message: 'Route unliked successfully' });
  } catch (error) {
    console.error('Unlike route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Pin management
router.post('/:id/pin', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
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
      types = []
    } = req.body;

    if (!name || !coordinates || !coordinates.lat || !coordinates.lng) {
      return res.status(400).json({ error: 'Name and coordinates are required' });
    }

    const route = await Route.findOne({ _id: id, user: req.user.id });
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const newPin = {
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
      order: route.pins.length
    };

    const updatedRoute = await Route.findByIdAndUpdate(
      id, 
      { $push: { pins: newPin } },
      { new: true }
    ).populate('user', 'username email');

    const addedPin = updatedRoute.pins[updatedRoute.pins.length - 1];

    res.json({ 
      message: 'Pin added successfully', 
      pin: addedPin,
      route: updatedRoute
    });
  } catch (error) {
    console.error('Add pin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/pins/:pinId', authenticateToken, async (req, res) => {
  try {
    const { id, pinId } = req.params;
    const updateData = req.body;

    const route = await Route.findOne({ _id: id, user: req.user.id });
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const pinIndex = route.pins.findIndex(pin => pin._id.toString() === pinId);
    if (pinIndex === -1) {
      return res.status(404).json({ error: 'Pin not found' });
    }

    route.pins[pinIndex] = { ...route.pins[pinIndex].toObject(), ...updateData };
    await route.save();

    res.json({ message: 'Pin updated successfully', pin: route.pins[pinIndex] });
  } catch (error) {
    console.error('Update pin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id/pins/:pinId', authenticateToken, async (req, res) => {
  try {
    const { id, pinId } = req.params;

    const route = await Route.findOne({ _id: id, user: req.user.id });
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const pinIndex = route.pins.findIndex(pin => pin._id.toString() === pinId);
    if (pinIndex === -1) {
      return res.status(404).json({ error: 'Pin not found' });
    }

    route.pins.splice(pinIndex, 1);
    await route.save();

    res.json({ message: 'Pin removed successfully' });
  } catch (error) {
    console.error('Remove pin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/pins/reorder', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { pinIds } = req.body; // Array of pin IDs in new order

    const route = await Route.findOne({ _id: id, user: req.user.id });
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    // Reorder pins based on provided order
    const reorderedPins = [];
    pinIds.forEach((pinId, index) => {
      const pin = route.pins.find(p => p._id.toString() === pinId);
      if (pin) {
        pin.order = index;
        reorderedPins.push(pin);
      }
    });

    route.pins = reorderedPins;
    await route.save();

    res.json({ message: 'Pins reordered successfully' });
  } catch (error) {
    console.error('Reorder pins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Favorite/Unfavorite route
router.post('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    if (!route.isPublic) {
      return res.status(403).json({ error: 'Cannot favorite private route' });
    }

    if (route.favorites.includes(userId)) {
      return res.status(400).json({ error: 'Route already favorited' });
    }

    await Route.findByIdAndUpdate(id, {
      $addToSet: { favorites: userId }
    });

    res.json({ message: 'Route favorited successfully' });
  } catch (error) {
    console.error('Favorite route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    if (!route.favorites.includes(userId)) {
      return res.status(400).json({ error: 'Route not favorited' });
    }

    await Route.findByIdAndUpdate(id, {
      $pull: { favorites: userId }
    });

    res.json({ message: 'Route unfavorited successfully' });
  } catch (error) {
    console.error('Unfavorite route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's favorite routes
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { sort } = req.query;

    let sortOption = { createdAt: -1 }; // default: latest
    switch (sort) {
      case 'latest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'likes':
        sortOption = { likesCount: -1, createdAt: -1 };
        break;
      case 'views':
        sortOption = { viewCount: -1, createdAt: -1 };
        break;
      case 'popular':
        sortOption = { likesCount: -1, viewCount: -1, createdAt: -1 };
        break;
    }

    const routes = await Route.find({ 
      isPublic: true, 
      favorites: userId 
    })
      .populate('user', 'username email')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Route.countDocuments({ 
      isPublic: true, 
      favorites: userId 
    });

    res.json({
      routes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get favorite routes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if route is favorited by user
router.get('/:id/favorite-status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const isFavorited = route.favorites.includes(userId);
    res.json({ isFavorited });
  } catch (error) {
    console.error('Check favorite status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get popular places (countries with most routes) for dashboard
router.get('/popular-places', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const popularPlaces = await Route.aggregate([
      { $match: { isPublic: true, country: { $exists: true, $ne: null, $ne: '' } } },
      { $group: { 
        _id: '$country', 
        count: { $sum: 1 },
        cities: { $addToSet: '$city' }
      } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: {
        country: '$_id',
        routeCount: '$count',
        cityCount: { $size: '$cities' },
        _id: 0
      }}
    ]);

    res.json({ popularPlaces });
  } catch (error) {
    console.error('Get popular places error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get routes by country
router.get('/by-country/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { sort } = req.query;
    const userId = req.user?.id; // Optional: for authenticated users

    // Apply sorting
    let sortOption = { createdAt: -1 }; // default: latest
    switch (sort) {
      case 'latest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'likes':
        sortOption = { likesCount: -1, createdAt: -1 };
        break;
      case 'views':
        sortOption = { viewCount: -1, createdAt: -1 };
        break;
      case 'popular':
        sortOption = { likesCount: -1, viewCount: -1, createdAt: -1 };
        break;
    }

    const routes = await Route.find({ 
      isPublic: true, 
      country: { $regex: country, $options: 'i' } 
    })
      .populate('user', 'username email')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Add favorite status for authenticated users
    if (userId) {
      routes.forEach(route => {
        route.isFavorited = route.favorites.includes(userId);
      });
    }

    const total = await Route.countDocuments({ 
      isPublic: true, 
      country: { $regex: country, $options: 'i' } 
    });

    res.json({
      routes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      country
    });
  } catch (error) {
    console.error('Get routes by country error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get route pins for map display
router.get('/:id/pins', async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findOne({ _id: id, isPublic: true })
      .select('pins title');

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    // Transform pins for map display
    const mapPins = route.pins.map((pin, index) => ({
      id: pin._id,
      name: pin.name,
      address: pin.address,
      coordinates: pin.coordinates,
      description: pin.description,
      image: pin.image,
      category: pin.category,
      rating: pin.rating,
      priceLevel: pin.priceLevel,
      order: pin.order || index,
      placeId: pin.placeId
    }));

    res.json({
      routeId: route._id,
      routeTitle: route.title,
      pins: mapPins,
      pinCount: mapPins.length
    });
  } catch (error) {
    console.error('Get route pins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Statistics
router.get('/stats', async (req, res) => {
  try {
    const totalRoutes = await Route.countDocuments({ isPublic: true });
    const totalUsers = await User.countDocuments();
    
    const categoryStats = await Route.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const countryStats = await Route.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalRoutes,
      totalUsers,
      categoryStats,
      countryStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;