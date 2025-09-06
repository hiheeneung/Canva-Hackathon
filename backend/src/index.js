import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import { initDatabase } from "./config/database.js";

// Import routes
import authRoutes from "./routes/auth.js";
import routes from "./routes/routes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: true, // 모든 origin 허용 (개발 환경에서만)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Travel Route API is running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/routes', routes);
app.use('/api/users', userRoutes);

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
  } catch (error) {
    console.error("⚠️ Database connection failed, but server will start anyway:", error.message);
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();
