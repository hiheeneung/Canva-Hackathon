import express from 'express';
import Route from '../models/Route.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId/routes', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { sort = 'latest', country, page = 1, limit = 10 } = req.query;

    // Check if user is accessing their own routes
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { user: userId };

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const routes = await Route.find(query)
      .populate('user', 'username email')
      .sort(sortOrder)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Route.countDocuments(query);

    res.json({
      routes,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get user routes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:userId/routes/favorites', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if user is accessing their own favorites
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const routes = await Route.find({
      favorites: userId,
      isPublic: true
    })
      .populate('user', 'username email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Route.countDocuments({
      favorites: userId,
      isPublic: true
    });

    res.json({
      routes,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:userId/routes/:routeId/favorite', authenticateToken, async (req, res) => {
  try {
    const { userId, routeId } = req.params;

    // Check if user is accessing their own favorites
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Check if route exists and is public
    const route = await Route.findOne({ _id: routeId, isPublic: true });
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    // Check if already favorited
    if (route.favorites.includes(userId)) {
      return res.status(400).json({ error: 'Route already in favorites' });
    }

    // Add to favorites
    await Route.findByIdAndUpdate(routeId, {
      $addToSet: { favorites: userId }
    });

    res.json({ message: 'Route added to favorites' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:userId/routes/:routeId/favorite', authenticateToken, async (req, res) => {
  try {
    const { userId, routeId } = req.params;

    // Check if user is accessing their own favorites
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Check if favorite exists
    const route = await Route.findOne({ _id: routeId, favorites: userId });
    if (!route) {
      return res.status(404).json({ error: 'Route not found in favorites' });
    }

    // Remove from favorites
    await Route.findByIdAndUpdate(routeId, {
      $pull: { favorites: userId }
    });

    res.json({ message: 'Route removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User statistics
router.get('/:userId/stats', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is accessing their own stats
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const userRoutes = await Route.find({ user: userId });
    const publicRoutes = await Route.find({ user: userId, isPublic: true });
    const totalLikes = userRoutes.reduce((sum, route) => sum + route.likes.length, 0);
    const totalViews = userRoutes.reduce((sum, route) => sum + route.viewCount, 0);
    const totalFavorites = await Route.countDocuments({ favorites: userId });

    // Category breakdown
    const categoryStats = await Route.aggregate([
      { $match: { user: userId, isPublic: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Country breakdown
    const countryStats = await Route.aggregate([
      { $match: { user: userId, isPublic: true } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRoutes = await Route.countDocuments({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      totalRoutes: userRoutes.length,
      publicRoutes: publicRoutes.length,
      privateRoutes: userRoutes.length - publicRoutes.length,
      totalLikes,
      totalViews,
      totalFavorites,
      categoryStats,
      countryStats,
      recentRoutes
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
