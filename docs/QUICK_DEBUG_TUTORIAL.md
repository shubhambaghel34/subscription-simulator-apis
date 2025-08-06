# 🚀 Quick Debugging Tutorial - Express.js Recurring Donations

## **Step 1: Enable Debug Mode**

```bash
# 1. Set debug environment
echo "LOG_LEVEL=debug" >> .env
echo "NODE_ENV=development" >> .env

# 2. Start server in debug mode
npm run dev
```

## **Step 2: Test Basic Functionality**

```bash
# Test health endpoint
curl http://localhost:3002/api/v1/health

# Test LLM service
curl http://localhost:3002/api/v1/subscriptions/debug/llm-test
```

## **Step 3: Debug Subscription Creation**

```bash
# Create subscription with debug logging
curl -X POST http://localhost:3002/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "debug-test",
    "amount": 1000,
    "currency": "USD", 
    "interval": "monthly",
    "campaignDescription": "Emergency relief for disaster victims"
  }' \
  -v
```

## **Step 4: Check Logs**

```bash
# Monitor logs in real-time
tail -f logs/combined.log

# Check error logs
tail -f logs/error.log
```

## **Step 5: VS Code Debugging**

1. **Open VS Code**
2. **Set breakpoints** in your code
3. **Press F5** or go to Run → Start Debugging
4. **Select "Debug Express App"** configuration
5. **Test your API** - execution will pause at breakpoints

## **Step 6: Common Issues & Solutions**

### Issue 1: Server Won't Start
```bash
# Check if port is in use
lsof -ti:3002
kill -9 <PID>

# Check TypeScript compilation
npm run build
```

### Issue 2: LLM Service Not Working
```bash
# Check OpenAI API key
echo $OPENAI_API_KEY

# Test LLM directly
curl http://localhost:3002/api/v1/subscriptions/debug/llm-test
```

### Issue 3: Validation Errors
```bash
# Test with invalid data
curl -X POST http://localhost:3002/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}' \
  -v
```

## **Step 7: Run Complete Debug Script**

```bash
# Run comprehensive debug test
node debug-script.js
```

## **Step 8: Performance Monitoring**

```bash
# Monitor memory usage
node --inspect --expose-gc src/server.ts

# Check request performance
curl -w "Time: %{time_total}s\n" http://localhost:3002/api/v1/health
```

## **🔍 Debug Checklist**

- [ ] Server running on port 3002
- [ ] LOG_LEVEL=debug in .env
- [ ] Health endpoint responding
- [ ] LLM service working
- [ ] Subscription creation successful
- [ ] Validation working
- [ ] Logs showing debug information
- [ ] No TypeScript compilation errors

## **📊 Debug Output Examples**

### Successful Debug Log:
```
[2025-08-04T16:00:00.000Z] [debug]: Request Details {
  "method": "POST",
  "url": "/api/v1/subscriptions",
  "body": {
    "donorId": "debug-test",
    "amount": 1000,
    "currency": "USD"
  }
}

[2025-08-04T16:00:00.100Z] [debug]: LLM analysis result {
  "tags": ["emergency", "disaster-relief"],
  "summary": "Emergency relief campaign...",
  "urgency": "high"
}

[2025-08-04T16:00:00.200Z] [debug]: Response Details {
  "statusCode": 201,
  "responseData": {
    "status": "success",
    "data": {
      "id": "sub_1234567890_abc123",
      "campaignAnalysis": {...}
    }
  }
}
```

### Error Debug Log:
```
[2025-08-04T16:00:00.000Z] [error]: Validation failed {
  "errors": [
    {
      "field": "amount",
      "message": "amount must be a positive number"
    }
  ]
}
```

## **🎯 Quick Commands Reference**

```bash
# Start debug mode
LOG_LEVEL=debug npm run dev

# Test API
curl http://localhost:3002/api/v1/health

# Monitor logs
tail -f logs/combined.log

# Run debug script
node debug-script.js

# VS Code debugging
# Press F5 and select "Debug Express App"
```

This quick tutorial will get you debugging your Express.js application in minutes! 🚀 