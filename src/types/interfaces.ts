import { Currency, SubscriptionInterval, TransactionStatus, UrgencyLevel } from './enums';

export interface CampaignAnalysis {
  tags: string[];
  summary: string;
  category?: string;
  urgency?: UrgencyLevel;
}

export interface Subscription {
  id: string;
  donorId: string;
  amount: number;
  currency: Currency;
  interval: SubscriptionInterval;
  campaignDescription: string;
  campaignAnalysis: CampaignAnalysis;
  isActive: boolean;
  createdAt: Date;
  nextBillingDate: Date;
}

export interface Transaction {
  id: string;
  subscriptionId: string;
  donorId: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  processedAt: Date;
  campaignDescription: string;
}

export interface CreateSubscriptionRequest {
  donorId: string;
  amount: number;
  currency: Currency;
  interval: SubscriptionInterval;
  campaignDescription: string;
}

export interface SubscriptionResponse {
  id: string;
  donorId: string;
  amount: number;
  currency: Currency;
  interval: SubscriptionInterval;
  campaignDescription: string;
  campaignAnalysis: CampaignAnalysis;
  isActive: boolean;
  createdAt: Date;
  nextBillingDate: Date;
}

export interface TransactionResponse {
  id: string;
  subscriptionId: string;
  donorId: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  processedAt: Date;
  campaignDescription: string;
}

export interface SubscriptionStatistics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  inactiveSubscriptions: number;
  totalMonthlyValue: number;
  subscriptionsByInterval: Record<string, number>;
}

export interface TransactionStatistics {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalAmountProcessed: number;
  averageTransactionAmount: number;
  transactionsByStatus: Record<string, number>;
  transactionsByCurrency: Record<string, number>;
}

export interface DonorTransactionHistory {
  donorId: string;
  totalDonations: number;
  totalAmount: number;
  averageDonation: number;
  firstDonation: Date | null;
  lastDonation: Date | null;
  transactions: TransactionResponse[];
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  data: {
    subscriptions: number;
    transactions: number;
    paymentStats: {
      totalTransactions: number;
      successfulTransactions: number;
      failedTransactions: number;
      totalAmountProcessed: number;
      averageTransactionAmount: number;
    };
  };
}

export interface SystemStats {
  subscriptions: {
    total: number;
  };
  transactions: {
    total: number;
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    totalAmountProcessed: number;
    averageTransactionAmount: number;
  };
  system: {
    memory: NodeJS.MemoryUsage;
    uptime: number;
    nodeVersion: string;
  };
}

export interface PaymentProcessingResult {
  processed: number;
  successful: number;
  failed: number;
  totalAmount: number;
} 