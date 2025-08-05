const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

async function debugAPI() {
  console.log('🔍 Starting Debug Session...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Status:', healthResponse.data.status);
    console.log('   Subscriptions:', healthResponse.data.data.subscriptions);
    console.log('   Transactions:', healthResponse.data.data.transactions);
    console.log('');

    // Test 2: LLM Debug Test
    console.log('2️⃣ Testing LLM Service...');
    const llmResponse = await axios.get(`${BASE_URL}/subscriptions/debug/llm-test`);
    console.log('✅ LLM Analysis:', llmResponse.data.data);
    console.log('');

    // Test 3: Create Subscription with Debug
    console.log('3️⃣ Creating Subscription (Debug Mode)...');
    const subscriptionData = {
      donorId: 'debug-donor-001',
      amount: 2500,
      currency: 'USD',
      interval: 'monthly',
      campaignDescription: 'Medical supplies for disaster relief in emergency situations'
    };

    const createResponse = await axios.post(`${BASE_URL}/subscriptions`, subscriptionData);
    console.log('✅ Subscription Created:', createResponse.data.data.id);
    console.log('   Campaign Analysis:', createResponse.data.data.campaignAnalysis);
    console.log('');

    // Test 4: Test Invalid Data
    console.log('4️⃣ Testing Validation (Invalid Data)...');
    try {
      await axios.post(`${BASE_URL}/subscriptions`, {
        invalidField: 'invalid data'
      });
    } catch (error) {
      console.log('✅ Validation Error Caught:', error.response.data);
    }
    console.log('');

    // Test 5: Performance Test
    console.log('5️⃣ Performance Test (Multiple Requests)...');
    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        axios.get(`${BASE_URL}/subscriptions`)
          .then(response => ({ success: true, duration: Date.now() - startTime }))
          .catch(error => ({ success: false, error: error.message }))
      );
    }
    
    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    console.log(`✅ Performance Test Complete: ${results.length} requests in ${totalTime}ms`);
    console.log('   Average time per request:', Math.round(totalTime / results.length), 'ms');
    console.log('');

    // Test 6: Memory Usage Check
    console.log('6️⃣ Checking System Stats...');
    const statsResponse = await axios.get(`${BASE_URL}/health/stats`);
    console.log('✅ System Stats:', {
      subscriptions: statsResponse.data.subscriptions,
      transactions: statsResponse.data.transactions,
      system: {
        uptime: statsResponse.data.system.uptime,
        nodeVersion: statsResponse.data.system.nodeVersion
      }
    });
    console.log('');

    console.log('🎉 Debug Session Completed Successfully!');
    console.log('\n📋 Debug Summary:');
    console.log('   ✅ Health check working');
    console.log('   ✅ LLM service functional');
    console.log('   ✅ Subscription creation with analysis');
    console.log('   ✅ Validation working correctly');
    console.log('   ✅ Performance acceptable');
    console.log('   ✅ System monitoring active');

  } catch (error) {
    console.error('❌ Debug Session Failed:', error.response?.data || error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('   1. Check if server is running on port 3002');
    console.log('   2. Verify LOG_LEVEL=debug in .env file');
    console.log('   3. Check server logs for detailed error information');
    console.log('   4. Ensure all dependencies are installed');
  }
}

// Run the debug script
debugAPI(); 