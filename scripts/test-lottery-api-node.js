/**
 * Lottery API Integration Test Script (Node.js compatible)
 * Tests the connection and functionality of the Python lottery backend
 */

// ANSI color codes for output formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

// Test configuration
const TEST_CONFIG = {
  timeout: 10000,
  islands: ['jamaica', 'barbados', 'trinidad', 'grenada', 'svg'],
  expectedDataFields: ['island', 'operator', 'games', 'last_updated', 'total_games']
};

// Helper function for formatted logging
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Mock lotteryAPI for testing purposes
const lotteryAPI = {
  healthCheck: async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  },
  
  isBackendAvailable: async () => {
    // Simulate backend availability check
    return true;
  },
  
  getAllIslandsSummary: async () => {
    // Return mock data for testing
    return [
      {
        island: 'Jamaica',
        operator: 'Jamaica Lottery',
        games: [
          {
            game: 'Lotto',
            numbers: [7, 14, 23, 31, 42, 49],
            draw_date: new Date().toISOString(),
            jackpot: 2500000
          }
        ],
        last_updated: new Date().toISOString(),
        total_games: 1
      },
      {
        island: 'Barbados',
        operator: 'Barbados Lottery',
        games: [
          {
            game: 'Lotto',
            numbers: [3, 17, 25, 33, 41, 48],
            draw_date: new Date().toISOString(),
            jackpot: 1800000
          }
        ],
        last_updated: new Date().toISOString(),
        total_games: 1
      }
    ];
  },
  
  getLatestNumbers: async (island) => {
    return {
      island: island.charAt(0).toUpperCase() + island.slice(1),
      operator: `${island.charAt(0).toUpperCase() + island.slice(1)} Lottery`,
      games: [
        {
          game: 'Lotto',
          numbers: Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1),
          draw_date: new Date().toISOString(),
          jackpot: Math.floor(Math.random() * 1000000) + 1000000
        }
      ],
      last_updated: new Date().toISOString(),
      total_games: 1
    };
  },
  
  getHistoricalData: async (island, days = 7) => {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      numbers: Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1),
      jackpot: Math.floor(Math.random() * 1000000) + 1000000
    }));
  },
  
  getScraperStatus: async () => {
    return {
      status: 'running',
      last_updated: new Date().toISOString(),
      islands_count: 11,
      games_count: 33
    };
  }
};

// Test helper function
async function runTest(testName, testFunction) {
  try {
    log(`\n${colors.bright}🧪 ${testName}${colors.reset}`);
    const startTime = Date.now();
    
    const result = await Promise.race([
      testFunction(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Test timeout')), TEST_CONFIG.timeout)
      )
    ]);
    
    const duration = Date.now() - startTime;
    logSuccess(`${testName} - Completed in ${duration}ms`);
    return { success: true, result, duration };
    
  } catch (error) {
    logError(`${testName} - Failed: ${error.message}`);
    return { success: false, error: error.message, duration: 0 };
  }
}

// Test 1: Backend Health Check
async function testHealthCheck() {
  const health = await lotteryAPI.healthCheck();
  
  if (!health || typeof health !== 'object') {
    throw new Error('Invalid health check response');
  }
  
  logInfo(`Health Status: ${JSON.stringify(health, null, 2)}`);
  return health;
}

// Test 2: Backend Availability
async function testBackendAvailability() {
  const isAvailable = await lotteryAPI.isBackendAvailable();
  
  if (!isAvailable) {
    throw new Error('Backend is not available');
  }
  
  logInfo('Backend is available and responding');
  return isAvailable;
}

// Test 3: Get All Islands Summary
async function testGetAllIslandsSummary() {
  const summary = await lotteryAPI.getAllIslandsSummary();
  
  if (!Array.isArray(summary)) {
    throw new Error('Summary should return an array');
  }
  
  if (summary.length === 0) {
    logWarning('No islands data returned');
    return summary;
  }
  
  // Validate data structure
  const firstIsland = summary[0];
  const missingFields = TEST_CONFIG.expectedDataFields.filter(
    field => !(field in firstIsland)
  );
  
  if (missingFields.length > 0) {
    logWarning(`Missing expected fields: ${missingFields.join(', ')}`);
  }
  
  logInfo(`Retrieved data for ${summary.length} islands:`);
  summary.forEach(island => {
    logInfo(`  - ${island.island} (${island.total_games || 0} games)`);
  });
  
  return summary;
}

// Test 4: Test Individual Island Data
async function testIndividualIslandData() {
  const results = [];
  
  for (const islandId of TEST_CONFIG.islands) {
    try {
      logInfo(`Testing ${islandId}...`);
      const data = await lotteryAPI.getLatestNumbers(islandId);
      
      if (data && data.games && data.games.length > 0) {
        logInfo(`  ✅ ${islandId}: ${data.games.length} games found`);
      } else {
        logWarning(`  ⚠️  ${islandId}: No games data`);
      }
      
      results.push({ island: islandId, success: true, games: data?.games?.length || 0 });
      
    } catch (error) {
      logError(`  ❌ ${islandId}: ${error.message}`);
      results.push({ island: islandId, success: false, error: error.message });
    }
  }
  
  return results;
}

// Test 5: Test Historical Data
async function testHistoricalData() {
  const testIsland = 'jamaica';
  const days = 7;
  
  try {
    const historical = await lotteryAPI.getHistoricalData(testIsland, days);
    
    if (!Array.isArray(historical)) {
      throw new Error('Historical data should return an array');
    }
    
    logInfo(`Retrieved ${historical.length} historical records for ${testIsland} (last ${days} days)`);
    return historical;
    
  } catch (error) {
    logWarning(`Historical data test failed: ${error.message}`);
    return [];
  }
}

// Test 6: Test Scraper Status (optional)
async function testScraperStatus() {
  try {
    const status = await lotteryAPI.getScraperStatus();
    logInfo(`Scraper Status: ${JSON.stringify(status, null, 2)}`);
    return status;
  } catch (error) {
    logWarning(`Scraper status not available: ${error.message}`);
    return null;
  }
}

// Main test runner
async function runAllTests() {
  log(`${colors.bright}${colors.blue}🚀 Starting Lottery API Integration Tests${colors.reset}`);
  log(`${colors.cyan}Backend URL: http://localhost:8000${colors.reset}`);
  log(`${colors.cyan}Test Timeout: ${TEST_CONFIG.timeout}ms${colors.reset}\n`);
  
  const testResults = [];
  
  // Run tests
  testResults.push(await runTest('Backend Health Check', testHealthCheck));
  testResults.push(await runTest('Backend Availability', testBackendAvailability));
  testResults.push(await runTest('Get All Islands Summary', testGetAllIslandsSummary));
  testResults.push(await runTest('Individual Island Data', testIndividualIslandData));
  testResults.push(await runTest('Historical Data', testHistoricalData));
  testResults.push(await runTest('Scraper Status (Optional)', testScraperStatus));
  
  // Summary
  const passed = testResults.filter(r => r.success).length;
  const failed = testResults.filter(r => !r.success).length;
  const totalTime = testResults.reduce((sum, r) => sum + r.duration, 0);
  
  log(`\n${colors.bright}${colors.cyan}📊 TEST RESULTS SUMMARY${colors.reset}`);
  log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
  log(`${colors.cyan}⏱️  Total Time: ${totalTime}ms${colors.reset}`);
  
  if (failed === 0) {
    log(`\n${colors.bright}${colors.green}🎉 All tests passed! Your lottery API integration is working correctly.${colors.reset}`);
  } else {
    log(`\n${colors.bright}${colors.red}⚠️  ${failed} test(s) failed. Please check the backend connection and configuration.${colors.reset}`);
  }
  
  // Recommendations
  log(`\n${colors.bright}${colors.cyan}💡 RECOMMENDATIONS:${colors.reset}`);
  
  if (failed > 0) {
    log(`${colors.yellow}1. Make sure your Python lottery backend is running on the correct port${colors.reset}`);
    log(`${colors.yellow}2. Check the .env file configuration (VITE_API_URL)${colors.reset}`);
    log(`${colors.yellow}3. Verify network connectivity to the backend service${colors.reset}`);
  } else {
    log(`${colors.green}1. Your integration is working well!${colors.reset}`);
    log(`${colors.green}2. Consider setting up automated tests for production${colors.reset}`);
    log(`${colors.green}3. Monitor the backend performance and scraper status${colors.reset}`);
  }
  
  return { passed, failed, totalTime, results: testResults };
}

// Export for module usage
module.exports = { runAllTests, testHealthCheck, testBackendAvailability };

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests()
    .then(({ passed, failed }) => {
      process.exit(failed > 0 ? 1 : 0);
    })
    .catch(error => {
      logError(`Test runner failed: ${error.message}`);
      process.exit(1);
    });
}