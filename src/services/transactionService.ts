import logger from '../utils/logger';
import storageService from './storageService';
import { 
  TransactionResponse, 
  TransactionStatistics, 
  DonorTransactionHistory
} from '../types/interfaces';
import { TransactionStatus } from '../types/enums';

class TransactionService {
  async getAllTransactions(): Promise<TransactionResponse[]> {
    const transactions = await storageService.getAllTransactions();
    return transactions.map(txn => this.mapToResponse(txn));
  }

  async getTransactionById(id: string): Promise<TransactionResponse | null> {
    const transaction = await storageService.getTransaction(id);
    return transaction ? this.mapToResponse(transaction) : null;
  }

  async getTransactionsBySubscriptionId(subscriptionId: string): Promise<TransactionResponse[]> {
    const transactions = await storageService.getTransactionsBySubscriptionId(subscriptionId);
    return transactions.map(txn => this.mapToResponse(txn));
  }

  async getTransactionsByDonorId(donorId: string): Promise<TransactionResponse[]> {
    const transactions = await storageService.getTransactionsByDonorId(donorId);
    return transactions.map(txn => this.mapToResponse(txn));
  }

  async getTransactionStatistics(): Promise<TransactionStatistics> {
    const allTransactions = await storageService.getAllTransactions();
    
    const successfulTransactions = allTransactions.filter(txn => txn.status === TransactionStatus.COMPLETED);
    const failedTransactions = allTransactions.filter(txn => txn.status === TransactionStatus.FAILED);
    
    const totalAmountProcessed = successfulTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const averageTransactionAmount = successfulTransactions.length > 0 
      ? totalAmountProcessed / successfulTransactions.length 
      : 0;

    // Group by status
    const transactionsByStatus: Record<string, number> = {};
    allTransactions.forEach(txn => {
      transactionsByStatus[txn.status] = (transactionsByStatus[txn.status] || 0) + 1;
    });

    // Group by currency
    const transactionsByCurrency: Record<string, number> = {};
    allTransactions.forEach(txn => {
      transactionsByCurrency[txn.currency] = (transactionsByCurrency[txn.currency] || 0) + 1;
    });

    return {
      totalTransactions: allTransactions.length,
      successfulTransactions: successfulTransactions.length,
      failedTransactions: failedTransactions.length,
      totalAmountProcessed,
      averageTransactionAmount: Math.round(averageTransactionAmount * 100) / 100,
      transactionsByStatus,
      transactionsByCurrency,
    };
  }

  async getDonorTransactionHistory(donorId: string): Promise<DonorTransactionHistory> {
    const transactions = await storageService.getTransactionsByDonorId(donorId);
    const successfulTransactions = transactions.filter(txn => txn.status === TransactionStatus.COMPLETED);

    const totalAmount = successfulTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const averageDonation = successfulTransactions.length > 0 
      ? totalAmount / successfulTransactions.length 
      : 0;

    const sortedTransactions = transactions.sort((a, b) => 
      new Date(a.processedAt).getTime() - new Date(b.processedAt).getTime()
    );

    return {
      donorId,
      totalDonations: successfulTransactions.length,
      totalAmount,
      averageDonation: Math.round(averageDonation * 100) / 100,
      firstDonation: sortedTransactions.length > 0 ? sortedTransactions[0].processedAt : null,
      lastDonation: sortedTransactions.length > 0 ? sortedTransactions[sortedTransactions.length - 1].processedAt : null,
      transactions: transactions.map(txn => this.mapToResponse(txn)),
    };
  }

  private mapToResponse(transaction: any): TransactionResponse {
    return {
      id: transaction.id,
      subscriptionId: transaction.subscriptionId,
      donorId: transaction.donorId,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      processedAt: transaction.processedAt,
      campaignDescription: transaction.campaignDescription,
    };
  }
}

export default new TransactionService(); 