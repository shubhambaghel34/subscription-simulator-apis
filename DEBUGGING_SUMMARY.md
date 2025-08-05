# 🔍 Complete Debugging Guide - Express.js Recurring Donations

## 🎯 **Quick Start (5 Minutes)**

### **Step 1: Enable Debug Mode**
```bash
# Set debug environment
echo "LOG_LEVEL=debug" >> .env
echo "NODE_ENV=development" >> .env

# Start server
npm run dev
```

### **Step 2: Run Debug Test**
```bash
# Install axios if not already installed
npm install axios

# Run comprehensive debug test
node debug-script.js
```

### **Step 3: Monitor Logs**
```bash
# Watch logs in real-time
tail -f logs/combined.log
```

## 🛠️ **Debugging Tools Available**

### **1. Debug Script** (`debug-script.js`)
- ✅ Health check testing
- ✅ LLM service validation
- ✅ Subscription creation with analysis
- ✅ Validation error testing
- ✅ Performance benchmarking
- ✅ System statistics monitoring

### **2. VS Code Debugging** (`.vscode/launch.json`)
- 🔧 **Debug Express App**: Full debugging with breakpoints
- 🔧 **Debug Tests**: Test debugging
- 🔧 **Debug with Breakpoints**: Step-by-step execution

### **3. Debug Middleware** (`src/middleware/debug.ts`)
- 📊 Request/Response logging
- ⏱️ Performance monitoring
- 🔍 Detailed request analysis

### **4. Debug Routes**
- `/api/v1/subscriptions/debug/llm-test` - Test LLM service
- Enhanced logging throughout the application

## 📊 **Debug Output Examples**

### **Successful Debug Session:**
```
🔍 Starting Debug Session...

1️⃣ Testing Health Check...
✅ Health Status: healthy
   Subscriptions: 0
   Transactions: 0

2️⃣ Testing LLM Service...
✅ LLM Analysis: {
  tags: ['emergency', 'disaster-relief', 'food-security', 'hunger-relief', 'water', 'sanitation'],
  summary: 'Campaign focused on water sanitation...',
  category: 'water-sanitation',
  urgency: 'high'
}

3️⃣ Creating Subscription (Debug Mode)...
✅ Subscription Created: sub_1754323546650_c3121fac
   Campaign Analysis: {
  tags: ['emergency', 'disaster-relief', 'healthcare', 'medical'],
  summary: 'Campaign focused on healthcare...',
  category: 'healthcare',
  urgency: 'high'
}

4️⃣ Testing Validation (Invalid Data)...
✅ Validation Error Caught: {
  status: 'error',
  message: 'Validation failed',
  errors: [...]
}

5️⃣ Performance Test (Multiple Requests)...
✅ Performance Test Complete: 5 requests in 10ms
   Average time per request: 2 ms

6️⃣ Checking System Stats...
✅ System Stats: {
  subscriptions: { total: 1 },
  transactions: { total: 0, ... },
  system: { uptime: 100.037253167, nodeVersion: 'v20.17.0' }
}

🎉 Debug Session Completed Successfully!
```

## 🔧 **Common Debugging Scenarios**

### **Scenario 1: Server Won't Start**
```bash
# Check port availability
lsof -ti:3002
kill -9 <PID>

# Check TypeScript compilation
npm run build

# Check environment variables
cat .env
```

### **Scenario 2: LLM Service Issues**
```bash
# Test LLM directly
curl http://localhost:3002/api/v1/subscriptions/debug/llm-test

# Check OpenAI API key
echo $OPENAI_API_KEY

# Test with fallback analysis (no API key needed)
# The service automatically falls back to keyword-based analysis
```

### **Scenario 3: Validation Errors**
```bash
# Test with invalid data
curl -X POST http://localhost:3002/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}' \
  -v
```

### **Scenario 4: Performance Issues**
```bash
# Monitor memory usage
node --inspect --expose-gc src/server.ts

# Check request performance
curl -w "Time: %{time_total}s\n" http://localhost:3002/api/v1/health

# Run performance test
node debug-script.js
```

## 🎯 **VS Code Debugging Setup**

### **1. Set Breakpoints**
- Click on line numbers in VS Code to set breakpoints
- Red dots will appear indicating breakpoints

### **2. Start Debugging**
- Press `F5` or go to Run → Start Debugging
- Select "Debug Express App" configuration
- The debugger will start and pause at breakpoints

### **3. Debug Controls**
- **Continue (F5)**: Continue execution
- **Step Over (F10)**: Execute current line
- **Step Into (F11)**: Go into function calls
- **Step Out (Shift+F11)**: Exit current function
- **Restart (Ctrl+Shift+F5)**: Restart debugging session

### **4. Debug Console**
- View variables and expressions
- Execute JavaScript code
- Monitor call stack

## 📋 **Debug Checklist**

### **Before Debugging:**
- [ ] Server running on port 3002
- [ ] LOG_LEVEL=debug in .env
- [ ] NODE_ENV=development in .env
- [ ] All dependencies installed
- [ ] TypeScript compilation successful

### **During Debugging:**
- [ ] Health endpoint responding
- [ ] LLM service functional
- [ ] Subscription creation working
- [ ] Validation errors caught properly
- [ ] Performance acceptable (< 100ms per request)
- [ ] Logs showing debug information
- [ ] No memory leaks detected

### **After Debugging:**
- [ ] Remove debug logs for production
- [ ] Test in production mode
- [ ] Document any issues found
- [ ] Add monitoring for prevention

## 🚀 **Quick Debug Commands**

```bash
# Start debug mode
LOG_LEVEL=debug npm run dev

# Test API endpoints
curl http://localhost:3002/api/v1/health
curl http://localhost:3002/api/v1/subscriptions/debug/llm-test

# Monitor logs
tail -f logs/combined.log
tail -f logs/error.log

# Run comprehensive debug test
node debug-script.js

# VS Code debugging
# Press F5 and select "Debug Express App"

# Performance testing
curl -w "Time: %{time_total}s\n" http://localhost:3002/api/v1/health

# Memory monitoring
node --inspect --expose-gc src/server.ts
```

## 🔍 **Advanced Debugging Techniques**

### **1. Memory Leak Detection**
```typescript
// Add to server.ts for memory monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();
  logger.debug('Memory Usage:', {
    rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`
  });
}, 30000);
```

### **2. Request Tracing**
```typescript
// Add unique request IDs for tracing
app.use((req, res, next) => {
  req.id = uuidv4();
  logger.debug(`Request ${req.id} started: ${req.method} ${req.url}`);
  next();
});
```

### **3. Error Tracking**
```typescript
// Enhanced error logging
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
});
```

## 📊 **Debug Metrics**

### **Performance Benchmarks:**
- **Health Check**: < 10ms
- **Subscription Creation**: < 100ms
- **LLM Analysis**: < 200ms (with API) / < 50ms (fallback)
- **Validation**: < 5ms
- **Memory Usage**: < 100MB for typical usage

### **Success Indicators:**
- ✅ All API endpoints responding
- ✅ LLM analysis working (API or fallback)
- ✅ Validation catching errors properly
- ✅ Background jobs scheduled
- ✅ Logs showing debug information
- ✅ No TypeScript compilation errors

## 🎉 **Debugging Success!**

Your Express.js recurring donations application is now fully debuggable with:

- **Comprehensive logging** at debug level
- **VS Code debugging** with breakpoints
- **Performance monitoring** and metrics
- **Error tracking** and validation
- **LLM service testing** and fallback
- **Automated debug scripts** for testing
- **Memory leak detection** and monitoring

**Next Steps:**
1. Use the debug tools to identify any issues
2. Monitor performance and optimize as needed
3. Add production monitoring and alerting
4. Document any specific issues found

Happy Debugging! 🚀🔍 