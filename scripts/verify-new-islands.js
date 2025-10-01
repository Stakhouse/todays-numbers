/**
 * Verification script for Dominica and Antigua & Barbuda lottery game implementation
 * This script checks that the new islands have been properly added to the LotteryContext
 */

import fs from 'fs';
import path from 'path';

// Function to check if a file contains specific text
function fileContainsText(filePath, searchText) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(searchText);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return false;
  }
}

// Function to check if a file contains all items in an array
function fileContainsAllText(filePath, searchTerms) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return searchTerms.every(term => content.includes(term));
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return false;
  }
}

console.log('🔍 Verifying implementation of Dominica and Antigua & Barbuda lottery games...\n');

// Check 1: LotteryContext.tsx should include both islands in mockIslands array
const lotteryContextPath = path.join('src', 'contexts', 'LotteryContext.tsx');
const islandsInMockData = fileContainsAllText(lotteryContextPath, ["'dominica'", "'antigua'"]);
console.log(`✅ LotteryContext includes both islands in mock data: ${islandsInMockData}`);

// Check 2: LotteryContext.tsx should have mock data for both islands
const dominicaMockData = fileContainsAllText(lotteryContextPath, [
  "'dominica'",
  "'Play 4'",
  "'Daily 3'",
  "'Big 4'",
  "'1-Off'",
  "'Pick 2'",
  "'Super 6'"
]);
console.log(`✅ Dominica mock data implemented: ${dominicaMockData}`);

const antiguaMockData = fileContainsAllText(lotteryContextPath, [
  "'antigua'",
  "'Super Lotto'",
  "'Lucky Pick'"
]);
console.log(`✅ Antigua & Barbuda mock data implemented: ${antiguaMockData}`);

// Check 3: App.tsx should include the new test routes
const appPath = path.join('src', 'App.tsx');
const testRoutes = fileContainsAllText(appPath, [
  'TestDominicaAntigua',
  'TestNewIslands',
  '/test-da',
  '/test-new-islands'
]);
console.log(`✅ Test routes added to App.tsx: ${testRoutes}`);

// Check 4: Test components should exist
const testComponent1Path = path.join('src', 'components', 'TestDominicaAntigua.tsx');
const testComponent2Path = path.join('src', 'components', 'TestNewIslands.tsx');
const testComponentsExist = fs.existsSync(testComponent1Path) && fs.existsSync(testComponent2Path);
console.log(`✅ Test components created: ${testComponentsExist}`);

// Check 5: Implementation summary document should exist
const summaryDocPath = path.join('DOMINICA_ANTIGUA_IMPLEMENTATION_SUMMARY.md');
const summaryDocExists = fs.existsSync(summaryDocPath);
console.log(`✅ Implementation summary document created: ${summaryDocExists}`);

console.log('\n📋 Verification Results:');
console.log('======================');
console.log(`LotteryContext mock data: ${islandsInMockData && dominicaMockData && antiguaMockData ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Test routes and components: ${testRoutes && testComponentsExist ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Documentation: ${summaryDocExists ? '✅ PASS' : '❌ FAIL'}`);

const allChecksPassed = 
  islandsInMockData && 
  dominicaMockData && 
  antiguaMockData && 
  testRoutes && 
  testComponentsExist && 
  summaryDocExists;

console.log('\n🏁 Overall Implementation Status:', allChecksPassed ? '✅ COMPLETE' : '❌ INCOMPLETE');

if (allChecksPassed) {
  console.log('\n🎉 Implementation successfully verified!');
  console.log('   Both Dominica and Antigua & Barbuda lottery games are ready for use.');
  console.log('   To test the implementation:');
  console.log('   1. Start the development server: npm run dev');
  console.log('   2. Visit http://localhost:5178/test-new-islands');
  console.log('   3. Verify that both island lottery cards display correctly');
} else {
  console.log('\n⚠️  Some implementation checks failed.');
  console.log('   Please review the output above to identify issues.');
}

export default {};