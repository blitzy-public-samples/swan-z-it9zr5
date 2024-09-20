import { createClient } from 'redis';
import { REDIS_URL, REDIS_PORT, REDIS_PASSWORD } from 'src/backend/config/env';
import logger from 'src/backend/utils/logger';

const redisClient = createClient({ url: `redis://${REDIS_URL}:${REDIS_PORT}`, password: REDIS_PASSWORD });

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('Successfully connected to Redis');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    await redisClient.quit();
    logger.info('Successfully disconnected from Redis');
  } catch (error) {
    logger.error('Failed to disconnect from Redis:', error);
  }
};

export { redisClient };