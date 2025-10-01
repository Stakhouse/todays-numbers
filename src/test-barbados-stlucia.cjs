// Test script to verify Barbados and St. Lucia mock data generation
const fs = require('fs');

// Read the LotteryContext file
const lotteryContextPath = './contexts/LotteryContext.tsx';
let lotteryContextContent = fs.readFileSync(lotteryContextPath, 'utf8');

// Extract the mock data generation function
// This is a simplified test - in a real scenario, we would run the actual function
console.log('Testing Barbados and St. Lucia mock data generation...');

// Check if Barbados data is present
if (lotteryContextContent.includes('barbados') && lotteryContextContent.includes('Super Lotto')) {
  console.log('✓ Barbados data structure found');
} else {
  console.log('✗ Barbados data structure missing');
}

// Check if St. Lucia data is present
if (lotteryContextContent.includes('st-lucia') && lotteryContextContent.includes('Super 6')) {
  console.log('✓ St. Lucia data structure found');
} else {
  console.log('✗ St. Lucia data structure missing');
}

// Check if multi-draw games are handled
if (lotteryContextContent.includes('draws:') && lotteryContextContent.includes('Pick 3')) {
  console.log('✓ Multi-draw game support found');
} else {
  console.log('✗ Multi-draw game support missing');
}

console.log('Test completed.');