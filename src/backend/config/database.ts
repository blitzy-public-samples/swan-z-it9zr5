import { Pool } from 'pg';
import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } from 'src/backend/config/env';
import logger from 'src/backend/utils/logger';

// Create a new Pool instance with the configuration
export const pool = new Pool({
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Establishes a connection to the database and tests it
 * @returns {Promise<void>} Resolves when the connection is established successfully
 */
export const connectDatabase = async (): Promise<void> => {
  let client;
  try {
    client = await pool.connect();
    logger.info('Successfully connected to the database');
  } catch (error) {
    logger.error('Failed to connect to the database', error);
    throw new Error('Database connection failed');
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Graceful shutdown function for the database pool
export const closeDatabase = async (): Promise<void> => {
  try {
    await pool.end();
    logger.info('Database pool has been closed');
  } catch (error) {
    logger.error('Error closing database pool', error);
    throw error;
  }
};

// Event listeners for the pool
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  logger.debug('New client connected to the database');
});

pool.on('remove', () => {
  logger.debug('Client removed from the pool');
});