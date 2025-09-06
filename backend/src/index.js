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
    openapi: "3.0.0",
    info: {
      title: "Canva Route Planner API",
      version: "1.0.0",
      description: "API documentation for Canva Route Planner application with authentication and route management",
      contact: {
        name: "API Support",
        email: "support@canva-hackathon.com"
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/routes/*.js", "./src/index.js"] // paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Canva Route Planner API"
}));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 */
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Import models and routes
import Route from "./models/Route.js";
import authRoutes from "./routes/auth.js";

// Use authentication routes
app.use("/api/auth", authRoutes);

// ---- API ENDPOINTS ----

// Get all routes
app.get("/api/routes", async (req, res) => {
  try {
    const routes = await Route.find();
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

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferMaxEntries: 0, // Disable mongoose buffering
    bufferCommands: false, // Disable mongoose buffering
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`✅ API listening on http://localhost:${PORT}`);
      console.log(`📚 Swagger UI available at http://localhost:${PORT}/api-docs`);
      console.log(`🔐 Authentication endpoints:`);
      console.log(`   POST /api/auth/signup - Register new user`);
      console.log(`   POST /api/auth/login - Login user`);
      console.log(`   POST /api/auth/logout - Logout user`);
      console.log(`   GET  /api/auth/me - Get current user profile`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("💡 Trying to start server without database connection for testing...");
    
    // Start server anyway for testing endpoints
    app.listen(PORT, () => {
      console.log(`⚠️  API listening on http://localhost:${PORT} (NO DATABASE)`);
      console.log(`📚 Swagger UI available at http://localhost:${PORT}/api-docs`);
      console.log(`🔐 Authentication endpoints will fail without database connection`);
    });
  });
