import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import designRoutes from './routes/designRoutes';
import errorHandler from './middleware/errorHandler';
import ApiError from './utils/ApiError';
import logger from './utils/logger';

const app: express.Application = express();

function setupMiddleware(): void {
  // Apply helmet for security headers
  app.use(helmet());

  // Enable CORS with appropriate options
  app.use(cors());

  // Parse JSON request bodies
  app.use(express.json());

  // Parse URL-encoded request bodies
  app.use(express.urlencoded({ extended: true }));

  // Enable request logging with morgan
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

  // Apply compression middleware
  app.use(compression());

  // Serve static files from the public directory
  app.use(express.static('public'));
}

function setupRoutes(): void {
  // Mount auth routes under /api/auth
  app.use('/api/auth', authRoutes);

  // Mount user routes under /api/users
  app.use('/api/users', userRoutes);

  // Mount product routes under /api/products
  app.use('/api/products', productRoutes);

  // Mount order routes under /api/orders
  app.use('/api/orders', orderRoutes);

  // Mount design routes under /api/designs
  app.use('/api/designs', designRoutes);
}

function setupErrorHandling(): void {
  // Add a 404 handler for undefined routes
  app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found'));
  });

  // Apply the global error handler middleware
  app.use(errorHandler);
}

// Set up middleware
setupMiddleware();

// Set up routes
setupRoutes();

// Set up error handling
setupErrorHandling();

export { app };