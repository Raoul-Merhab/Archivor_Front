import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import mongoose from 'mongoose';

const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
  }
};

export default connectMongoDB;