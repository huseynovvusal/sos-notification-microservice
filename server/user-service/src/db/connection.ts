import logger from '@/lib/logger';
import mongoose from 'mongoose';

export const connectDatabase = async (mongoURI: string) => {
  try {
    const db = await mongoose.connect(mongoURI);

    logger.info(`MongoDB connected: ${db.connection.host}:${db.connection.port} (${db.connection.name})`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
