import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

const server = app.listen(PORT, () => {
  console.log(`User service is running on port ${PORT}`);
});

// Graceful shutdown
function shutdown() {
  console.log('Shutting down user service...');

  server.close(() => {
    console.log('User service has shut down gracefully.');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
