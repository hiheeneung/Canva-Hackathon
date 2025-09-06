// server/src/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Route Planner API',
      version: '1.0.0',
      description: 'API for managing routes and places',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Pin: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            lat: { type: 'number' },
            lng: { type: 'number' },
            note: { type: 'string' }
          }
        },
        Route: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            name: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
            category: { type: 'string' },
            pins: {
              type: 'array',
              items: { $ref: '#/components/schemas/Pin' }
            },
            likes: { type: 'number' },
            likedBy: {
              type: 'array',
              items: { type: 'string' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./src/index.js'], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 */
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Import Routes model
import Route from "./models/Route.js";

// ---- API ENDPOINTS ----

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Get all routes with filtering and sorting
 *     tags: [Routes]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, likes]
 *         description: Sort by creation date or likes
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of routes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Route'
 */
app.get("/api/routes", async (req, res) => {
  try {
    const { sort, country, city, category } = req.query;
    let query = {};
    
    // Apply filters
    if (country) query.country = country;
    if (city) query.city = city;
    if (category) query.category = category;
    
    // Apply sorting
    let sortOption = {};
    if (sort === 'latest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'likes') {
      sortOption = { likes: -1 };
    }
    
    const routes = await Route.find(query).sort(sortOption);
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new route
app.post("/api/routes", async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get route by ID
app.get("/api/routes/:id", async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ error: "Route not found" });
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update route
app.put("/api/routes/:id", async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!route) return res.status(404).json({ error: "Route not found" });
    res.json(route);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete route
app.delete("/api/routes/:id", async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ error: "Route not found" });
    res.json({ message: "Route deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- ROUTE ACTIONS ----

// Like a route
app.post("/api/routes/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ error: "Route not found" });
    
    if (!route.likedBy.includes(userId)) {
      route.likedBy.push(userId);
      route.likes += 1;
      await route.save();
    }
    
    res.json({ message: "Route liked successfully", likes: route.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unlike a route
app.delete("/api/routes/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ error: "Route not found" });
    
    if (route.likedBy.includes(userId)) {
      route.likedBy = route.likedBy.filter(id => id !== userId);
      route.likes = Math.max(0, route.likes - 1);
      await route.save();
    }
    
    res.json({ message: "Route unliked successfully", likes: route.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add pin to route
app.post("/api/routes/:id/pin", async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ error: "Route not found" });
    
    route.pins.push(req.body);
    await route.save();
    
    res.json({ message: "Pin added successfully", route });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update pin
app.put("/api/routes/:id/pins/:pinId", async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ error: "Route not found" });
    
    const pinIndex = route.pins.findIndex(pin => pin._id.toString() === req.params.pinId);
    if (pinIndex === -1) return res.status(404).json({ error: "Pin not found" });
    
    route.pins[pinIndex] = { ...route.pins[pinIndex].toObject(), ...req.body };
    await route.save();
    
    res.json({ message: "Pin updated successfully", route });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove pin
app.delete("/api/routes/:id/pins/:pinId", async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ error: "Route not found" });
    
    route.pins = route.pins.filter(pin => pin._id.toString() !== req.params.pinId);
    await route.save();
    
    res.json({ message: "Pin removed successfully", route });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reorder pins
app.put("/api/routes/:id/pins/reorder", async (req, res) => {
  try {
    const { pinOrder } = req.body; // Array of pin IDs in new order
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ error: "Route not found" });
    
    const reorderedPins = pinOrder.map(pinId => 
      route.pins.find(pin => pin._id.toString() === pinId)
    ).filter(Boolean);
    
    route.pins = reorderedPins;
    await route.save();
    
    res.json({ message: "Pins reordered successfully", route });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---- GOOGLE MAPS INTEGRATION ----

// Search places (mock implementation - replace with actual Google Places API)
app.get("/api/places/search", async (req, res) => {
  try {
    const { query, location } = req.query;
    
    // Mock response - replace with actual Google Places API call
    const mockPlaces = [
      {
        placeId: "1",
        name: "Seoul Tower",
        address: "Seoul, South Korea",
        lat: 37.5512,
        lng: 126.9882,
        rating: 4.5
      },
      {
        placeId: "2", 
        name: "Gyeongbokgung Palace",
        address: "Seoul, South Korea",
        lat: 37.5796,
        lng: 126.9770,
        rating: 4.7
      }
    ];
    
    res.json(mockPlaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get place details (mock implementation)
app.get("/api/places/:placeId/details", async (req, res) => {
  try {
    const { placeId } = req.params;
    
    // Mock response - replace with actual Google Places API call
    const mockPlaceDetails = {
      placeId,
      name: "Place Name",
      address: "Full Address",
      lat: 37.5512,
      lng: 126.9882,
      rating: 4.5,
      reviews: [],
      photos: []
    };
    
    res.json(mockPlaceDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- STATISTICS & ANALYTICS ----

// Get route statistics
app.get("/api/routes/stats", async (req, res) => {
  try {
    const totalRoutes = await Route.countDocuments();
    const totalLikes = await Route.aggregate([
      { $group: { _id: null, total: { $sum: "$likes" } } }
    ]);
    
    const popularRoutes = await Route.find().sort({ likes: -1 }).limit(5);
    const recentRoutes = await Route.find().sort({ createdAt: -1 }).limit(5);
    
    res.json({
      totalRoutes,
      totalLikes: totalLikes[0]?.total || 0,
      popularRoutes,
      recentRoutes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user statistics
app.get("/api/users/:userId/stats", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userRoutes = await Route.find({ userId });
    const totalLikes = userRoutes.reduce((sum, route) => sum + route.likes, 0);
    
    res.json({
      totalRoutes: userRoutes.length,
      totalLikes,
      routes: userRoutes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ API listening on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
