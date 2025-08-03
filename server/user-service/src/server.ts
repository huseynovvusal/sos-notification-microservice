import express from 'express';
import router from '@/routes';
import mongoose from 'mongoose';
import { Server } from 'http';
import { connectDatabase } from './db/connection';
import { config } from './config';

let server: Server;
const PORT = process.env.PORT || 3000;

const app = express();

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router
app.use('/api/users', router);

async function initialize() {
  await connectDatabase(`${config.MONGO_URI}`);

  server = app.listen(PORT, () => {
    console.log(`User service is running on PORT:${PORT}`);
  });
}

initialize();

// Graceful shutdown
async function shutdown() {
  console.log('Shutting down user service...');

  await mongoose.connection.close();

  server?.close(() => {
    console.log('User service has shut down gracefully.');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
