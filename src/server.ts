import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import subscriptionRoutes from './routes/subscriptions';
import transactionRoutes from './routes/transactions';
import healthRoutes from './routes/health';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { debugMiddleware, responseDebugMiddleware, performanceMiddleware } from './middleware/debug';
import backgroundJobService from './services/backgroundJobService';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());

// CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

// Debug middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(debugMiddleware);
  app.use(responseDebugMiddleware);
  app.use(performanceMiddleware);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/health', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Recurring Donations API',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Recurring Donations API is running on: http://localhost:${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api/v1/health`);
  logger.info(`⏰ Background jobs are scheduled to run every hour`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app; 