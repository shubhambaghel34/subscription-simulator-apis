const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testAPI() {
  console.log('🧪 Testing Recurring Donations API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.status);
    console.log('   Subscriptions:', healthResponse.data.data.subscriptions);
    console.log('   Transactions:', healthResponse.data.data.transactions);
    console.log('');

    // Test 2: Create Subscription
    console.log('2. Creating Subscription...');
    const subscriptionData = {
      donorId: 'abc123',
      amount: 1500,
      currency: 'USD',
      interval: 'monthly',
      campaignDescription: 'Emergency food and clean water for earthquake victims in Nepal'
    };

    const createResponse = await axios.post(`${BASE_URL}/subscriptions`, subscriptionData);
    const subscription = createResponse.data;
    console.log('✅ Subscription Created:', subscription.id);
    console.log('   Campaign Analysis:', subscription.campaignAnalysis);
    console.log('');

    // Test 3: Get All Subscriptions
    console.log('3. Getting All Subscriptions...');
    const subscriptionsResponse = await axios.get(`${BASE_URL}/subscriptions`);
    console.log('✅ Subscriptions Count:', subscriptionsResponse.data.length);
    console.log('');

    // Test 4: Get Subscription Statistics
    console.log('4. Getting Subscription Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/subscriptions/stats/overview`);
    console.log('✅ Subscription Stats:', statsResponse.data);
    console.log('');

    // Test 5: Get Transaction Statistics
    console.log('5. Getting Transaction Statistics...');
    const transactionStatsResponse = await axios.get(`${BASE_URL}/transactions/stats/overview`);
    console.log('✅ Transaction Stats:', transactionStatsResponse.data);
    console.log('');

    // Test 6: System Statistics
    console.log('6. Getting System Statistics...');
    const systemStatsResponse = await axios.get(`${BASE_URL}/health/stats`);
    console.log('✅ System Stats:', {
      subscriptions: systemStatsResponse.data.subscriptions,
      transactions: systemStatsResponse.data.transactions,
      system: {
        uptime: systemStatsResponse.data.system.uptime,
        nodeVersion: systemStatsResponse.data.system.nodeVersion
      }
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   - Wait for background jobs to process payments (runs every hour)');
    console.log('   - Check transaction history after payments are processed');
    console.log('   - Try creating more subscriptions with different intervals');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the server is running on http://localhost:3000');
  }
}

// Run the test
testAPI(); 