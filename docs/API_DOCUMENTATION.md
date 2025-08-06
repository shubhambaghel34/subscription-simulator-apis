# Recurring Donations API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication
Currently, the API does not require authentication. In production, implement proper authentication and authorization.

## Response Format
All API responses follow this format:
```json
{
  "status": "success|error",
  "data": {...},
  "message": "Optional message"
}
```

## Endpoints

### Subscriptions

#### Create Subscription
**POST** `/subscriptions`

Creates a new recurring donation subscription with automatic LLM analysis.

**Request Body:**
```json
{
  "donorId": "string (required)",
  "amount": "number (required, min: 1)",
  "currency": "USD|EUR|GBP|CAD|AUD (required)",
  "interval": "daily|weekly|monthly|yearly (required)",
  "campaignDescription": "string (required)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "abc123",
    "amount": 1500,
    "currency": "USD",
    "interval": "monthly",
    "campaignDescription": "Emergency food and clean water for earthquake victims in Nepal"
  }'
```

**Response:**
```json
{
  "id": "sub_1754321090899_dagil2aoc",
  "donorId": "abc123",
  "amount": 1500,
  "currency": "USD",
  "interval": "monthly",
  "campaignDescription": "Emergency food and clean water for earthquake victims in Nepal",
  "campaignAnalysis": {
    "tags": ["emergency", "disaster-relief", "food-security", "hunger-relief", "water", "sanitation"],
    "summary": "Campaign focused on water sanitation. Emergency food and clean water for earthquake victims in Nepal...",
    "category": "water-sanitation",
    "urgency": "high"
  },
  "isActive": true,
  "createdAt": "2025-08-04T15:24:50.899Z",
  "nextBillingDate": "2025-09-04T15:24:50.899Z"
}
```

#### Get All Subscriptions
**GET** `/subscriptions`

Returns all subscriptions (active and inactive).

**Response:**
```json
[
  {
    "id": "sub_1754321090899_dagil2aoc",
    "donorId": "abc123",
    "amount": 1500,
    "currency": "USD",
    "interval": "monthly",
    "campaignDescription": "Emergency food and clean water for earthquake victims in Nepal",
    "campaignAnalysis": {...},
    "isActive": true,
    "createdAt": "2025-08-04T15:24:50.899Z",
    "nextBillingDate": "2025-09-04T15:24:50.899Z"
  }
]
```

#### Get Active Subscriptions
**GET** `/subscriptions/active`

Returns only active subscriptions.

#### Get Subscription by ID
**GET** `/subscriptions/{id}`

Returns a specific subscription by ID.

**Response:**
```json
{
  "id": "sub_1754321090899_dagil2aoc",
  "donorId": "abc123",
  "amount": 1500,
  "currency": "USD",
  "interval": "monthly",
  "campaignDescription": "Emergency food and clean water for earthquake victims in Nepal",
  "campaignAnalysis": {...},
  "isActive": true,
  "createdAt": "2025-08-04T15:24:50.899Z",
  "nextBillingDate": "2025-09-04T15:24:50.899Z"
}
```

#### Deactivate Subscription
**DELETE** `/subscriptions/{id}`

Deactivates a subscription (sets isActive to false).

**Response:**
```json
{
  "id": "sub_1754321090899_dagil2aoc",
  "donorId": "abc123",
  "amount": 1500,
  "currency": "USD",
  "interval": "monthly",
  "campaignDescription": "Emergency food and clean water for earthquake victims in Nepal",
  "campaignAnalysis": {...},
  "isActive": false,
  "createdAt": "2025-08-04T15:24:50.899Z",
  "nextBillingDate": "2025-09-04T15:24:50.899Z"
}
```

#### Get Subscription Statistics
**GET** `/subscriptions/stats/overview`

Returns comprehensive subscription statistics.

**Response:**
```json
{
  "totalSubscriptions": 3,
  "activeSubscriptions": 3,
  "inactiveSubscriptions": 0,
  "totalMonthlyValue": 3873.33,
  "subscriptionsByInterval": {
    "monthly": 1,
    "weekly": 1,
    "yearly": 1
  }
}
```

### Transactions

#### Get All Transactions
**GET** `/transactions`

Returns all transactions.

**Response:**
```json
[
  {
    "id": "txn_1754321090899_abc123",
    "subscriptionId": "sub_1754321090899_dagil2aoc",
    "donorId": "abc123",
    "amount": 1500,
    "currency": "USD",
    "status": "completed",
    "processedAt": "2025-08-04T15:24:50.899Z",
    "campaignDescription": "Emergency food and clean water for earthquake victims in Nepal"
  }
]
```

#### Get Transaction by ID
**GET** `/transactions/{id}`

Returns a specific transaction by ID.

#### Get Transactions by Subscription
**GET** `/transactions/subscription/{subscriptionId}`

Returns all transactions for a specific subscription.

#### Get Transactions by Donor
**GET** `/transactions/donor/{donorId}`

Returns all transactions for a specific donor.

#### Get Donor Transaction History
**GET** `/transactions/donor/{donorId}/history`

Returns comprehensive transaction history for a donor.

**Response:**
```json
{
  "donorId": "abc123",
  "totalDonations": 5,
  "totalAmount": 7500,
  "averageDonation": 1500,
  "firstDonation": "2025-08-04T15:24:50.899Z",
  "lastDonation": "2025-09-04T15:24:50.899Z",
  "transactions": [...]
}
```

#### Get Transaction Statistics
**GET** `/transactions/stats/overview`

Returns comprehensive transaction statistics.

**Response:**
```json
{
  "totalTransactions": 10,
  "successfulTransactions": 9,
  "failedTransactions": 1,
  "totalAmountProcessed": 15000,
  "averageTransactionAmount": 1500,
  "transactionsByStatus": {
    "completed": 9,
    "failed": 1
  },
  "transactionsByCurrency": {
    "USD": 6,
    "EUR": 2,
    "GBP": 2
  }
}
```

### Health & Monitoring

#### Health Check
**GET** `/health`

Returns basic health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-04T15:24:43.521Z",
  "uptime": 21.081508042,
  "data": {
    "subscriptions": 3,
    "transactions": 0,
    "paymentStats": {
      "totalTransactions": 0,
      "successfulTransactions": 0,
      "failedTransactions": 0,
      "totalAmountProcessed": 0,
      "averageTransactionAmount": 0
    }
  }
}
```

#### System Statistics
**GET** `/health/stats`

Returns detailed system statistics.

**Response:**
```json
{
  "subscriptions": {
    "total": 3
  },
  "transactions": {
    "total": 0,
    "totalTransactions": 0,
    "successfulTransactions": 0,
    "failedTransactions": 0,
    "totalAmountProcessed": 0,
    "averageTransactionAmount": 0
  },
  "system": {
    "memory": {
      "rss": 123456789,
      "heapTotal": 987654321,
      "heapUsed": 123456789,
      "external": 123456
    },
    "uptime": 21.081508042,
    "nodeVersion": "v18.17.0"
  }
}
```

## Data Models

### Subscription
```typescript
{
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
```

### Campaign Analysis (LLM Generated)
```typescript
{
  tags: string[];
  summary: string;
  category?: string;
  urgency?: 'low' | 'medium' | 'high';
}
```

### Transaction
```typescript
{
  id: string;
  subscriptionId: string;
  donorId: string;
  amount: number;
  currency: Currency;
  status: 'pending' | 'completed' | 'failed';
  processedAt: Date;
  campaignDescription: string;
}
```

## Enums

### Currency
- `USD` - US Dollar
- `EUR` - Euro
- `GBP` - British Pound
- `CAD` - Canadian Dollar
- `AUD` - Australian Dollar

### Subscription Interval
- `daily` - Daily donations
- `weekly` - Weekly donations
- `monthly` - Monthly donations
- `yearly` - Yearly donations

## Error Responses

### Validation Error
```json
{
  "statusCode": 400,
  "message": ["amount must be a positive number"],
  "error": "Bad Request"
}
```

### Not Found Error
```json
{
  "statusCode": 404,
  "message": "Subscription with ID sub_123 not found",
  "error": "Not Found"
}
```

### Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Background Jobs

The application includes automated background jobs:

1. **Payment Processing**: Runs every hour to process due subscriptions
2. **Daily Summary**: Generates daily payment statistics at 9 AM

## LLM Integration

The service uses OpenAI GPT-3.5-turbo to analyze campaign descriptions and generate:
- Relevant tags for categorization
- Short summaries
- Campaign categories
- Urgency levels

If OpenAI API key is not provided, the service falls back to keyword-based analysis.

## Rate Limiting

Currently, no rate limiting is implemented. In production, implement appropriate rate limiting.

## CORS

CORS is enabled for all origins. In production, configure appropriate CORS settings. 