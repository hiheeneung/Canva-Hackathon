import mongoose from 'mongoose';

let isConnected = false;

export const initDatabase = async () => {
  try {
    if (isConnected) {
      console.log('📦 MongoDB already connected');
      return;
    }

    // Use environment variable or fallback to local MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/canva-hackathon';
    
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 10000,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 60000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
    };
    
    await mongoose.connect(mongoUri, options);
    isConnected = true;
    console.log('📦 MongoDB connected successfully');
    
    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📦 MongoDB disconnected');
      isConnected = false;
    });

    return mongoose.connection;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    isConnected = false;
    throw error;
  }
};

export const getDatabase = () => {
  if (!isConnected) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return mongoose.connection;
};

export const closeDatabase = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('📦 MongoDB connection closed');
  }
};
