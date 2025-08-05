import cron from 'node-cron';
import logger from '../utils/logger';
import paymentService from './paymentService';

class BackgroundJobService {
  constructor() {
    this.initializeJobs();
  }

  private initializeJobs() {
    // Process payments every hour
    cron.schedule('0 * * * *', async () => {
      logger.info('Starting scheduled payment processing...');
      
      try {
        const result = await paymentService.processBatchPayments();
        
        if (result.processed > 0) {
          logger.info(`Payment processing completed: ${JSON.stringify(result)}`);
        }
      } catch (error) {
        logger.error('Error in scheduled payment processing:', error);
      }
    });

    // Daily summary at 9 AM
    cron.schedule('0 9 * * *', async () => {
      logger.info('Generating daily payment summary...');
      
      try {
        const stats = await paymentService.getPaymentStatistics();
        logger.info(`Daily Summary: ${JSON.stringify(stats)}`);
      } catch (error) {
        logger.error('Error generating daily summary:', error);
      }
    });

    logger.info('Background jobs initialized');
  }

  async triggerPaymentProcessing() {
    logger.info('Manually triggering payment processing...');
    return paymentService.processBatchPayments();
  }
}

export default new BackgroundJobService(); 