import { Subscription, Transaction } from '../types/interfaces';

class StorageService {
  private subscriptions: Map<string, Subscription> = new Map();
  private transactions: Map<string, Transaction> = new Map();

  // Subscription methods
  async saveSubscription(subscription: Subscription): Promise<Subscription> {
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  async getSubscription(id: string): Promise<Subscription | null> {
    return this.subscriptions.get(id) || null;
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values());
  }

  async getActiveSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(sub => sub.isActive);
  }

  async updateSubscription(subscription: Subscription): Promise<Subscription> {
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  async deleteSubscription(id: string): Promise<boolean> {
    return this.subscriptions.delete(id);
  }

  // Transaction methods
  async saveTransaction(transaction: Transaction): Promise<Transaction> {
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    return this.transactions.get(id) || null;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransactionsBySubscriptionId(subscriptionId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      txn => txn.subscriptionId === subscriptionId
    );
  }

  async getTransactionsByDonorId(donorId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      txn => txn.donorId === donorId
    );
  }

  // Utility methods
  async getSubscriptionCount(): Promise<number> {
    return this.subscriptions.size;
  }

  async getTransactionCount(): Promise<number> {
    return this.transactions.size;
  }

  async clearAll(): Promise<void> {
    this.subscriptions.clear();
    this.transactions.clear();
  }
}

export default new StorageService(); 