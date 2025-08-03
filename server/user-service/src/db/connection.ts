import mongoose from 'mongoose';

export const connectDatabase = async (mongoURI: string) => {
  try {
    const db = await mongoose.connect(mongoURI);

    console.log(`MongoDB connected: ${db.connection.host}:${db.connection.port} (${db.connection.name})`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
