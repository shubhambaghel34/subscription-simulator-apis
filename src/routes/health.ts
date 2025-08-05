import { Router, Request, Response } from 'express';
import storageService from '../services/storageService';
import paymentService from '../services/paymentService';
import { HealthStatus, SystemStats } from '../types/interfaces';

const router = Router();

// Health check
router.get('/', async (req: Request, res: Response) => {
  try {
    const subscriptionCount = await storageService.getSubscriptionCount();
    const transactionCount = await storageService.getTransactionCount();
    const paymentStats = await paymentService.getPaymentStatistics();

    const healthStatus: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      data: {
        subscriptions: subscriptionCount,
        transactions: transactionCount,
        paymentStats,
      },
    };

    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      error: 'Failed to get health status',
    });
  }
});

// System statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const subscriptionCount = await storageService.getSubscriptionCount();
    const transactionCount = await storageService.getTransactionCount();
    const paymentStats = await paymentService.getPaymentStatistics();

    const systemStats: SystemStats = {
      subscriptions: {
        total: subscriptionCount,
      },
      transactions: {
        total: transactionCount,
        ...paymentStats,
      },
      system: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        nodeVersion: process.version,
      },
    };

    res.json(systemStats);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get system statistics',
    });
  }
});

export default router; 