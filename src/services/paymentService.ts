import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';
import storageService from './storageService';
import { Subscription, Transaction, PaymentProcessingResult } from '../types/interfaces';
import { TransactionStatus } from '../types/enums';

class PaymentService {
  async processSubscriptionPayment(subscription: Subscription): Promise<Transaction> {
    logger.info(`Processing payment for subscription ${subscription.id}`);

    // Create a new transaction
    const transaction: Transaction = {
      id: `txn_${Date.now()}_${uuidv4().substr(0, 8)}`,
      subscriptionId: subscription.id,
      donorId: subscription.donorId,
      amount: subscription.amount,
      currency: subscription.currency,
      status: TransactionStatus.PENDING,
      processedAt: new Date(),
      campaignDescription: subscription.campaignDescription,
    };

    try {
      // Simulate payment processing with some randomness for realism
      const successRate = 0.95; // 95% success rate
      const isSuccessful = Math.random() < successRate;

      if (isSuccessful) {
        transaction.status = TransactionStatus.COMPLETED;
        logger.info(`Payment successful for subscription ${subscription.id}: ${subscription.amount} ${subscription.currency}`);
      } else {
        transaction.status = TransactionStatus.FAILED;
        logger.warn(`Payment failed for subscription ${subscription.id}: ${subscription.amount} ${subscription.currency}`);
      }

      // Save the transaction
      await storageService.saveTransaction(transaction);

      // Update subscription's next billing date if payment was successful
      if (isSuccessful) {
        subscription.nextBillingDate = this.calculateNextBillingDate(subscription);
        await storageService.updateSubscription(subscription);
      }

      return transaction;
    } catch (error) {
      logger.error(`Error processing payment for subscription ${subscription.id}:`, error);
      transaction.status = TransactionStatus.FAILED;
      await storageService.saveTransaction(transaction);
      throw error;
    }
  }

  async processBatchPayments(): Promise<PaymentProcessingResult> {
    logger.info('Starting batch payment processing...');

    const activeSubscriptions = await storageService.getActiveSubscriptions();
    const dueSubscriptions = activeSubscriptions.filter(sub => this.isDueForBilling(sub));

    if (dueSubscriptions.length === 0) {
      logger.info('No subscriptions due for billing');
      return { processed: 0, successful: 0, failed: 0, totalAmount: 0 };
    }

    logger.info(`Processing ${dueSubscriptions.length} due subscriptions`);

    let successful = 0;
    let failed = 0;
    let totalAmount = 0;

    for (const subscription of dueSubscriptions) {
      try {
        const transaction = await this.processSubscriptionPayment(subscription);
        
        if (transaction.status === TransactionStatus.COMPLETED) {
          successful++;
          totalAmount += subscription.amount;
        } else {
          failed++;
        }
      } catch (error) {
        logger.error(`Failed to process subscription ${subscription.id}:`, error);
        failed++;
      }
    }

    const result = {
      processed: dueSubscriptions.length,
      successful,
      failed,
      totalAmount,
    };

    logger.info(`Batch processing completed: ${JSON.stringify(result)}`);
    return result;
  }

  async getPaymentStatistics() {
    const allTransactions = await storageService.getAllTransactions();
    
    const successfulTransactions = allTransactions.filter(txn => txn.status === TransactionStatus.COMPLETED);
    const failedTransactions = allTransactions.filter(txn => txn.status === TransactionStatus.FAILED);
    
    const totalAmountProcessed = successfulTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const averageTransactionAmount = successfulTransactions.length > 0 
      ? totalAmountProcessed / successfulTransactions.length 
      : 0;

    return {
      totalTransactions: allTransactions.length,
      successfulTransactions: successfulTransactions.length,
      failedTransactions: failedTransactions.length,
      totalAmountProcessed,
      averageTransactionAmount,
    };
  }

  private isDueForBilling(subscription: Subscription): boolean {
    return subscription.isActive && new Date() >= subscription.nextBillingDate;
  }

  private calculateNextBillingDate(subscription: Subscription): Date {
    const now = new Date();
    const nextDate = new Date(now);

    switch (subscription.interval) {
      case 'daily':
        nextDate.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(now.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(now.getFullYear() + 1);
        break;
    }

    return nextDate;
  }
}

export default new PaymentService(); 