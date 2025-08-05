# Debugging Guide for Express.js Recurring Donations App

## 🚀 Quick Start Debugging

### Step 1: Enable Debug Mode

1. **Add debug logging to your environment:**
```bash
# Create .env file with debug settings
echo "LOG_LEVEL=debug" >> .env
echo "NODE_ENV=development" >> .env
```

2. **Start the server in debug mode:**
```bash
# Method 1: Using ts-node-dev with debug
npm run dev

# Method 2: Using Node.js debugger
node --inspect-brk -r ts-node/register src/server.ts

# Method 3: Using VS Code debugger (recommended)
```

### Step 2: VS Code Debugging Setup

1. **Create `.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Express App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/server.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development",
        "LOG_LEVEL": "debug",
        "PORT": "3002"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"],
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Step 3: Add Debug Logging

1. **Enhanced Logger with Debug Levels:**
```typescript
// src/utils/logger.ts
import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'recurring-donations-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
      })
    )
  }));
}

export default logger;
```

### Step 4: Add Debug Middleware

```typescript
// src/middleware/debug.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const debugMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.LOG_LEVEL === 'debug') {
    logger.debug('Request Details', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }
  next();
};

export const responseDebugMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  res.send = function(data) {
    if (process.env.LOG_LEVEL === 'debug') {
      logger.debug('Response Details', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseData: data
      });
    }
    return originalSend.call(this, data);
  };
  next();
};
```

### Step 5: Update Server with Debug Middleware

```typescript
// src/server.ts
import { debugMiddleware, responseDebugMiddleware } from './middleware/debug';

// Add debug middleware early in the chain
app.use(debugMiddleware);
app.use(responseDebugMiddleware);
```

## 🔧 Common Debugging Scenarios

### Scenario 1: Subscription Creation Issues

**Debug Steps:**
1. **Check Request Validation:**
```bash
curl -X POST http://localhost:3002/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"donorId": "test", "amount": 100, "currency": "USD", "interval": "monthly", "campaignDescription": "test"}' \
  -v
```

2. **Add Debug Logs to Subscription Service:**
```typescript
// src/services/subscriptionService.ts
async createSubscription(request: CreateSubscriptionRequest): Promise<SubscriptionResponse> {
  logger.debug('Creating subscription with request:', request);
  
  try {
    // Analyze campaign description using LLM
    logger.debug('Analyzing campaign with LLM...');
    const campaignAnalysis = await llmService.analyzeCampaign(request.campaignDescription);
    logger.debug('LLM analysis result:', campaignAnalysis);

    // Create subscription entity
    logger.debug('Creating subscription entity...');
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
    logger.debug('Subscription entity created:', subscription);

    // Save subscription
    logger.debug('Saving subscription to storage...');
    const savedSubscription = await storageService.saveSubscription(subscription);
    logger.debug('Subscription saved successfully:', savedSubscription.id);

    return this.mapToResponse(savedSubscription);
  } catch (error) {
    logger.error('Error in createSubscription:', error);
    throw error;
  }
}
```

### Scenario 2: LLM Service Issues

**Debug Steps:**
1. **Check OpenAI API Key:**
```bash
echo $OPENAI_API_KEY
```

2. **Test LLM Service Directly:**
```typescript
// Add this to your routes for testing
router.get('/debug/llm-test', async (req: Request, res: Response) => {
  try {
    const testDescription = "Emergency food and clean water for earthquake victims";
    logger.debug('Testing LLM with description:', testDescription);
    
    const result = await llmService.analyzeCampaign(testDescription);
    logger.debug('LLM test result:', result);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    logger.error('LLM test error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});
```

### Scenario 3: Background Job Issues

**Debug Steps:**
1. **Add Debug Logs to Background Jobs:**
```typescript
// src/services/backgroundJobService.ts
private initializeJobs() {
  logger.debug('Initializing background jobs...');
  
  // Process payments every hour
  cron.schedule('0 * * * *', async () => {
    logger.debug('Starting scheduled payment processing...');
    
    try {
      const result = await paymentService.processBatchPayments();
      logger.debug('Payment processing result:', result);
      
      if (result.processed > 0) {
        logger.info(`Payment processing completed: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      logger.error('Error in scheduled payment processing:', error);
    }
  });

  // Daily summary at 9 AM
  cron.schedule('0 9 * * *', async () => {
    logger.debug('Generating daily payment summary...');
    
    try {
      const stats = await paymentService.getPaymentStatistics();
      logger.debug('Daily summary stats:', stats);
      logger.info(`Daily Summary: ${JSON.stringify(stats)}`);
    } catch (error) {
      logger.error('Error generating daily summary:', error);
    }
  });

  logger.info('Background jobs initialized');
}
```

### Scenario 4: Database/Storage Issues

**Debug Steps:**
1. **Add Storage Debug Logs:**
```typescript
// src/services/storageService.ts
async saveSubscription(subscription: Subscription): Promise<Subscription> {
  logger.debug('Saving subscription:', subscription.id);
  this.subscriptions.set(subscription.id, subscription);
  logger.debug('Subscription saved. Total subscriptions:', this.subscriptions.size);
  return subscription;
}

async getAllSubscriptions(): Promise<Subscription[]> {
  logger.debug('Getting all subscriptions. Count:', this.subscriptions.size);
  return Array.from(this.subscriptions.values());
}
```

## 🐛 Advanced Debugging Techniques

### 1. Memory Leak Detection

```typescript
// Add to server.ts
setInterval(() => {
  const memUsage = process.memoryUsage();
  logger.debug('Memory Usage:', {
    rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
  });
}, 30000); // Log every 30 seconds
```

### 2. Request Performance Monitoring

```typescript
// src/middleware/performance.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug('Request Performance', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
};
```

### 3. Error Tracking

```typescript
// src/middleware/errorTracker.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorTracker = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Application Error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  
  next(err);
};
```

## 🧪 Testing and Debugging

### 1. Unit Test Debugging

```typescript
// src/services/subscriptionService.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals';
import subscriptionService from '../services/subscriptionService';

describe('SubscriptionService', () => {
  beforeEach(() => {
    // Clear storage before each test
    require('../services/storageService').default.clearAll();
  });

  it('should create subscription with debug logging', async () => {
    const request = {
      donorId: 'test-donor',
      amount: 100,
      currency: 'USD',
      interval: 'monthly',
      campaignDescription: 'Test campaign'
    };

    console.log('Creating subscription with:', request);
    const result = await subscriptionService.createSubscription(request);
    console.log('Subscription created:', result);
    
    expect(result).toBeDefined();
    expect(result.donorId).toBe('test-donor');
  });
});
```

### 2. API Testing with Debug

```bash
# Test with verbose output
curl -X POST http://localhost:3002/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"donorId": "debug-test", "amount": 100, "currency": "USD", "interval": "monthly", "campaignDescription": "Debug test campaign"}' \
  -v \
  -w "\nTime: %{time_total}s\nStatus: %{http_code}\n"

# Test health endpoint
curl -v http://localhost:3002/api/v1/health

# Test with invalid data
curl -X POST http://localhost:3002/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}' \
  -v
```

## 🔍 Debugging Checklist

### Before Starting Debug:
- [ ] Check if server is running
- [ ] Verify environment variables
- [ ] Check logs for errors
- [ ] Verify API endpoints are accessible

### During Debug:
- [ ] Enable debug logging
- [ ] Add breakpoints in VS Code
- [ ] Monitor network requests
- [ ] Check memory usage
- [ ] Verify data flow

### After Debug:
- [ ] Remove debug logs
- [ ] Test in production mode
- [ ] Document the issue and solution
- [ ] Add monitoring for future prevention

## 🛠️ Debugging Tools

### 1. VS Code Extensions
- **Node.js Debugger**: Built-in
- **REST Client**: For API testing
- **Thunder Client**: Alternative to Postman
- **Error Lens**: Better error highlighting

### 2. Command Line Tools
```bash
# Monitor logs in real-time
tail -f logs/combined.log

# Check for memory leaks
node --inspect --expose-gc src/server.ts

# Profile performance
node --prof src/server.ts
```

### 3. Browser Tools
- **Network Tab**: Monitor API calls
- **Console**: Check for JavaScript errors
- **Application Tab**: Check local storage

## 📊 Monitoring and Alerting

### 1. Health Check Monitoring
```typescript
// Add to your monitoring
setInterval(async () => {
  try {
    const response = await fetch('http://localhost:3002/api/v1/health');
    const health = await response.json();
    
    if (health.status !== 'healthy') {
      logger.error('Health check failed:', health);
      // Send alert
    }
  } catch (error) {
    logger.error('Health check error:', error);
    // Send alert
  }
}, 60000); // Check every minute
```

### 2. Performance Monitoring
```typescript
// Track slow requests
export const slowRequestTracker = (threshold: number = 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (duration > threshold) {
        logger.warn('Slow request detected', {
          method: req.method,
          url: req.url,
          duration: `${duration}ms`,
          threshold: `${threshold}ms`
        });
      }
    });
    
    next();
  };
};
```

This comprehensive debugging guide will help you identify and resolve issues in your Express.js recurring donations application effectively! 