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

    const routes = await Route.find({ isPublic: true })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Route.countDocuments({ isPublic: true });

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

    const routes = await Route.find({ isPublic: true })
      .populate('user', 'username email')
      .sort({ likesCount: -1, createdAt: -1 })
      .limit(limit);

    res.json({ routes });
  } catch (error) {
    console.error('Get popular routes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findOne({ _id: id, isPublic: true })
      .populate('user', 'username email');

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json(route);
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, city, country, locations, isPublic = true } = req.body;

    if (!title || !locations || !Array.isArray(locations)) {
      return res.status(400).json({ error: 'Title and locations are required' });
    }

    const newRoute = new Route({
      title,
      description,
      city,
      country,
      locations,
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

export default router;