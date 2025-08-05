import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';
import storageService from './storageService';
import llmService from './llmService';
import { 
  Subscription, 
  CreateSubscriptionRequest, 
  SubscriptionResponse, 
  SubscriptionStatistics
} from '../types/interfaces';
import { SubscriptionInterval } from '../types/enums';

class SubscriptionService {
  async createSubscription(request: CreateSubscriptionRequest): Promise<SubscriptionResponse> {
    logger.info(`Creating subscription for donor ${request.donorId}`);

    // Analyze campaign description using LLM
    const campaignAnalysis = await llmService.analyzeCampaign(request.campaignDescription);

    // Create subscription entity
    const subscription: Subscription = {
      id: `sub_${Date.now()}_${uuidv4().substr(0, 8)}`,
      donorId: request.donorId,
      amount: request.amount,
      currency: request.currency,
      interval: request.interval,
      campaignDescription: request.campaignDescription,
      campaignAnalysis,
      isActive: true,
      createdAt: new Date(),
      nextBillingDate: this.calculateNextBillingDate(request.interval),
    };

    // Save subscription
    const savedSubscription = await storageService.saveSubscription(subscription);

    logger.info(`Subscription created successfully: ${savedSubscription.id}`);

    return this.mapToResponse(savedSubscription);
  }

  async getAllSubscriptions(): Promise<SubscriptionResponse[]> {
    const subscriptions = await storageService.getAllSubscriptions();
    return subscriptions.map(sub => this.mapToResponse(sub));
  }

  async getActiveSubscriptions(): Promise<SubscriptionResponse[]> {
    const subscriptions = await storageService.getActiveSubscriptions();
    return subscriptions.map(sub => this.mapToResponse(sub));
  }

  async getSubscriptionById(id: string): Promise<SubscriptionResponse | null> {
    const subscription = await storageService.getSubscription(id);
    return subscription ? this.mapToResponse(subscription) : null;
  }

  async deactivateSubscription(id: string): Promise<SubscriptionResponse | null> {
    const subscription = await storageService.getSubscription(id);
    
    if (!subscription) {
      return null;
    }

    subscription.isActive = false;
    const updatedSubscription = await storageService.updateSubscription(subscription);

    logger.info(`Subscription ${id} deactivated`);

    return this.mapToResponse(updatedSubscription);
  }

  async getSubscriptionStatistics(): Promise<SubscriptionStatistics> {
    const allSubscriptions = await storageService.getAllSubscriptions();
    const activeSubscriptions = allSubscriptions.filter(sub => sub.isActive);
    const inactiveSubscriptions = allSubscriptions.filter(sub => !sub.isActive);

    // Calculate total monthly value (normalized to monthly)
    let totalMonthlyValue = 0;
    const subscriptionsByInterval: Record<string, number> = {};

    for (const subscription of activeSubscriptions) {
      // Count by interval
      subscriptionsByInterval[subscription.interval] = 
        (subscriptionsByInterval[subscription.interval] || 0) + 1;

      // Calculate monthly value
      let monthlyAmount = subscription.amount;
      switch (subscription.interval) {
        case SubscriptionInterval.DAILY:
          monthlyAmount = subscription.amount * 30;
          break;
        case SubscriptionInterval.WEEKLY:
          monthlyAmount = subscription.amount * 4.33; // Average weeks per month
          break;
        case SubscriptionInterval.MONTHLY:
          monthlyAmount = subscription.amount;
          break;
        case SubscriptionInterval.YEARLY:
          monthlyAmount = subscription.amount / 12;
          break;
      }
      totalMonthlyValue += monthlyAmount;
    }

    return {
      totalSubscriptions: allSubscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      inactiveSubscriptions: inactiveSubscriptions.length,
      totalMonthlyValue: Math.round(totalMonthlyValue * 100) / 100,
      subscriptionsByInterval,
    };
  }

  private calculateNextBillingDate(interval: SubscriptionInterval): Date {
    const now = new Date();
    const nextDate = new Date(now);

    switch (interval) {
      case SubscriptionInterval.DAILY:
        nextDate.setDate(now.getDate() + 1);
        break;
      case SubscriptionInterval.WEEKLY:
        nextDate.setDate(now.getDate() + 7);
        break;
      case SubscriptionInterval.MONTHLY:
        nextDate.setMonth(now.getMonth() + 1);
        break;
      case SubscriptionInterval.YEARLY:
        nextDate.setFullYear(now.getFullYear() + 1);
        break;
    }

    return nextDate;
  }

  private mapToResponse(subscription: Subscription): SubscriptionResponse {
    return {
      id: subscription.id,
      donorId: subscription.donorId,
      amount: subscription.amount,
      currency: subscription.currency,
      interval: subscription.interval,
      campaignDescription: subscription.campaignDescription,
      campaignAnalysis: subscription.campaignAnalysis,
      isActive: subscription.isActive,
      createdAt: subscription.createdAt,
      nextBillingDate: subscription.nextBillingDate,
    };
  }
}

export default new SubscriptionService(); 