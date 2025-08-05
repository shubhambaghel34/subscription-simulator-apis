import { Router, Request, Response } from 'express';
import subscriptionService from '../services/subscriptionService';
import { validateCreateSubscription, validateId, handleValidationErrors } from '../middleware/validation';
import { createError } from '../middleware/errorHandler';
import logger from '../utils/logger';

const router = Router();

// Create subscription
router.post('/', validateCreateSubscription, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const subscription = await subscriptionService.createSubscription(req.body);
    res.status(201).json({
      status: 'success',
      data: subscription,
    });
  } catch (error) {
    logger.error('Error creating subscription:', error);
    throw createError('Failed to create subscription', 500);
  }
});

// Get all subscriptions
router.get('/', async (req: Request, res: Response) => {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();
    res.json({
      status: 'success',
      data: subscriptions,
    });
  } catch (error) {
    logger.error('Error fetching subscriptions:', error);
    throw createError('Failed to fetch subscriptions', 500);
  }
});

// Get active subscriptions
router.get('/active', async (req: Request, res: Response) => {
  try {
    const subscriptions = await subscriptionService.getActiveSubscriptions();
    res.json({
      status: 'success',
      data: subscriptions,
    });
  } catch (error) {
    logger.error('Error fetching active subscriptions:', error);
    throw createError('Failed to fetch active subscriptions', 500);
  }
});

// Get subscription by ID
router.get('/:id', validateId, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const subscription = await subscriptionService.getSubscriptionById(req.params.id);
    
    if (!subscription) {
      throw createError('Subscription not found', 404);
    }

    res.json({
      status: 'success',
      data: subscription,
    });
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    logger.error('Error fetching subscription:', error);
    throw createError('Failed to fetch subscription', 500);
  }
});

// Deactivate subscription
router.delete('/:id', validateId, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const subscription = await subscriptionService.deactivateSubscription(req.params.id);
    
    if (!subscription) {
      throw createError('Subscription not found', 404);
    }

    res.json({
      status: 'success',
      data: subscription,
    });
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    logger.error('Error deactivating subscription:', error);
    throw createError('Failed to deactivate subscription', 500);
  }
});

// Get subscription statistics
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const stats = await subscriptionService.getSubscriptionStatistics();
    res.json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    logger.error('Error fetching subscription statistics:', error);
    throw createError('Failed to fetch subscription statistics', 500);
  }
});

// Debug route for testing LLM service
// router.get('/debug/llm-test', async (req: Request, res: Response) => {
//   try {
//     const testDescription = "Emergency food and clean water for earthquake victims";
//     logger.debug('Testing LLM with description:', testDescription);
    
//     const llmService = require('../services/llmService').default;
//     const result = await llmService.analyzeCampaign(testDescription);
//     logger.debug('LLM test result:', result);
    
//     res.json({
//       status: 'success',
//       data: result
//     });
//   } catch (error) {
//     logger.error('LLM test error:', error);
//     res.status(500).json({
//       status: 'error',
//       message: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

export default router; 