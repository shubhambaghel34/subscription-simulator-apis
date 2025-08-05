import { Router, Request, Response } from 'express';
import transactionService from '../services/transactionService';
import { validateId, validateDonorId, validateSubscriptionId, handleValidationErrors } from '../middleware/validation';
import { createError } from '../middleware/errorHandler';
import logger from '../utils/logger';

const router = Router();

// Get all transactions
router.get('/', async (req: Request, res: Response) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.json({
      status: 'success',
      data: transactions,
    });
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    throw createError('Failed to fetch transactions', 500);
  }
});

// Get transaction by ID
router.get('/:id', validateId, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    
    if (!transaction) {
      throw createError('Transaction not found', 404);
    }

    res.json({
      status: 'success',
      data: transaction,
    });
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    logger.error('Error fetching transaction:', error);
    throw createError('Failed to fetch transaction', 500);
  }
});

// Get transactions by subscription ID
router.get('/subscription/:subscriptionId', validateSubscriptionId, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const transactions = await transactionService.getTransactionsBySubscriptionId(req.params.subscriptionId);
    res.json({
      status: 'success',
      data: transactions,
    });
  } catch (error) {
    logger.error('Error fetching transactions by subscription:', error);
    throw createError('Failed to fetch transactions by subscription', 500);
  }
});

// Get transactions by donor ID
router.get('/donor/:donorId', validateDonorId, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const transactions = await transactionService.getTransactionsByDonorId(req.params.donorId);
    res.json({
      status: 'success',
      data: transactions,
    });
  } catch (error) {
    logger.error('Error fetching transactions by donor:', error);
    throw createError('Failed to fetch transactions by donor', 500);
  }
});

// Get donor transaction history
router.get('/donor/:donorId/history', validateDonorId, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const history = await transactionService.getDonorTransactionHistory(req.params.donorId);
    res.json({
      status: 'success',
      data: history,
    });
  } catch (error) {
    logger.error('Error fetching donor transaction history:', error);
    throw createError('Failed to fetch donor transaction history', 500);
  }
});

// Get transaction statistics
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const stats = await transactionService.getTransactionStatistics();
    res.json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    logger.error('Error fetching transaction statistics:', error);
    throw createError('Failed to fetch transaction statistics', 500);
  }
});

export default router; 