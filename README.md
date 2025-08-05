# Express.js Recurring Donations Backend Service

A comprehensive Express.js backend service for managing recurring donations with LLM-powered campaign analysis and automated payment processing.

## Features

- **Subscription Management**: Create and manage recurring donation subscriptions
- **LLM Integration**: Automatic campaign analysis using OpenAI GPT-3.5-turbo
- **Automated Payments**: Background job processing for recurring charges
- **Multi-Currency Support**: USD, EUR, GBP, CAD, AUD
- **Flexible Intervals**: Daily, weekly, monthly, yearly subscriptions
- **Transaction Tracking**: Complete history of all donation transactions
- **Health Monitoring**: System health checks and statistics
- **Clean Architecture**: SOLID principles, DRY, and reusable code
- **Security**: Helmet, CORS, Rate limiting, Input validation

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **LLM**: OpenAI GPT-3.5-turbo
- **Scheduling**: node-cron
- **Validation**: express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting
- **Storage**: In-memory (can be easily replaced with database)

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (optional, fallback analysis available)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd express-donations-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Configure environment variables:
```env
PORT=3002
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

5. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:3002/api/v1`

## API Endpoints

### Subscriptions

#### Create Subscription
```http
POST /api/v1/subscriptions
Content-Type: application/json

{
  "donorId": "abc123",
  "amount": 1500,
  "currency": "USD",
  "interval": "monthly",
  "campaignDescription": "Emergency food and clean water for earthquake victims in Nepal"
}
```

#### Get All Subscriptions
```http
GET /api/v1/subscriptions
```

#### Get Active Subscriptions
```http
GET /api/v1/subscriptions/active
```

#### Get Subscription by ID
```http
GET /api/v1/subscriptions/:id
```

#### Deactivate Subscription
```http
DELETE /api/v1/subscriptions/:id
```

#### Get Subscription Statistics
```http
GET /api/v1/subscriptions/stats/overview
```

### Transactions

#### Get All Transactions
```http
GET /api/v1/transactions
```

#### Get Transaction by ID
```http
GET /api/v1/transactions/:id
```

#### Get Transactions by Subscription
```http
GET /api/v1/transactions/subscription/:subscriptionId
```

#### Get Transactions by Donor
```http
GET /api/v1/transactions/donor/:donorId
```

#### Get Donor Transaction History
```http
GET /api/v1/transactions/donor/:donorId/history
```

#### Get Transaction Statistics
```http
GET /api/v1/transactions/stats/overview
```

### Health & Monitoring

#### Health Check
```http
GET /api/v1/health
```

#### System Statistics
```http
GET /api/v1/health/stats
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

## Background Jobs

The application includes automated background jobs:

- **Payment Processing**: Runs every hour to process due subscriptions
- **Daily Summary**: Generates daily payment statistics at 9 AM

## LLM Integration

The service uses OpenAI GPT-3.5-turbo to analyze campaign descriptions and generate:

- Relevant tags for categorization
- Short summaries
- Campaign categories
- Urgency levels

If OpenAI API key is not provided, the service falls back to keyword-based analysis.

## Architecture

The application follows clean architecture principles:

- **Routes**: Handle HTTP requests and responses
- **Services**: Business logic and data processing
- **Middleware**: Validation, error handling, security
- **Types**: TypeScript interfaces and enums
- **Utils**: Shared utilities and logging

### Directory Structure
```
src/
├── types/
│   ├── enums.ts
│   └── interfaces.ts
├── services/
│   ├── llmService.ts
│   ├── storageService.ts
│   ├── paymentService.ts
│   ├── subscriptionService.ts
│   ├── transactionService.ts
│   └── backgroundJobService.ts
├── routes/
│   ├── subscriptions.ts
│   ├── transactions.ts
│   └── health.ts
├── middleware/
│   ├── validation.ts
│   └── errorHandler.ts
├── utils/
│   └── logger.ts
└── server.ts
```

## Development

### Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Testing
npm test
npm run test:watch

# Linting
npm run lint
npm run lint:fix
```

### Adding New Features

1. Create service with business logic
2. Create routes for API endpoints
3. Add validation middleware
4. Update types/interfaces
5. Follow existing patterns for consistency

## Testing

The application includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **Input Validation**: Request validation
- **Error Handling**: Secure error responses

## Deployment

### Environment Variables

- `PORT`: Server port (default: 3002)
- `NODE_ENV`: Environment (development/production)
- `OPENAI_API_KEY`: OpenAI API key for LLM features
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window
- `LOG_LEVEL`: Logging level

### Production Considerations

- Replace in-memory storage with persistent database
- Add authentication and authorization
- Implement HTTPS
- Add monitoring and alerting
- Use environment-specific configurations
- Set up proper logging and monitoring

## API Response Format

All API responses follow this format:
```json
{
  "status": "success|error",
  "data": {...},
  "message": "Optional message"
}
```

## Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: 400 Bad Request
- **Not Found Errors**: 404 Not Found
- **Server Errors**: 500 Internal Server Error
- **Rate Limiting**: 429 Too Many Requests

## Logging

The application uses Winston for logging:

- **File Logging**: Error and combined logs
- **Console Logging**: Development mode
- **Structured Logging**: JSON format in production

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## License

This project is licensed under the MIT License. 