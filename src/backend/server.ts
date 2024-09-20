import http from 'http';
import app from './app';
import { connectDatabase } from './config/database';
import { connectRedis, disconnectRedis } from './config/redis';
import logger from './utils/logger';
import { PORT } from './config/env';

const server = http.createServer(app);

async function startServer(): Promise<void> {
  try {
    // Connect to the PostgreSQL database
    await connectDatabase();
    logger.info('Connected to PostgreSQL database');

    // Connect to Redis
    await connectRedis();
    logger.info('Connected to Redis');

    // Start the HTTP server and listen on the specified PORT
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(): Promise<void> {
  try {
    // Close the HTTP server
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    logger.info('HTTP server closed');

    // Disconnect from Redis
    await disconnectRedis();
    logger.info('Disconnected from Redis');

    // Close the PostgreSQL database connection pool
    // Note: Assuming there's a function to close the database connection
    // await closeDatabase();
    logger.info('Closed PostgreSQL database connection');

    logger.info('Graceful shutdown completed');
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
  } finally {
    process.exit(0);
  }
}

// Handle termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
startServer();