/**
 * Ad Management Components Test Script
 * 
 * This script tests the Ad Management components to ensure they're working properly.
 * It checks for the existence of required files and validates the component structure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths to check
const basePath = path.resolve(__dirname, '..');
const adSubmissionsListPath = path.join(basePath, 'src', 'components', 'admin', 'AdSubmissionsList.tsx');
const adManagementPath = path.join(basePath, 'src', 'components', 'admin', 'pages', 'AdManagement.tsx');
const adminTypesPath = path.join(basePath, 'src', 'types', 'admin.ts');

// ANSI color codes for output formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper function to check if a file exists
function checkFileExists(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`${colors.green}✓${colors.reset} ${description} exists at ${colors.cyan}${filePath}${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${description} does not exist at ${colors.cyan}${filePath}${colors.reset}`);
      return false;
    }
  } catch (err) {
    console.error(`${colors.red}Error checking ${description}:${colors.reset}`, err);
    return false;
  }
}

// Helper function to check if a file contains specific content
function checkFileContains(filePath, searchString, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchString)) {
      console.log(`${colors.green}✓${colors.reset} ${description}`);
      return true;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${description}`);
      return false;
    }
  } catch (err) {
    console.error(`${colors.red}Error checking content in ${filePath}:${colors.reset}`, err);
    return false;
  }
}

// Main test function
function runTests() {
  console.log(`${colors.bright}${colors.cyan}=== Ad Management Components Test ====${colors.reset}\n`);
  
  let allPassed = true;
  
  // Check if required files exist
  const filesExist = [
    checkFileExists(adSubmissionsListPath, 'AdSubmissionsList component'),
    checkFileExists(adManagementPath, 'AdManagement component'),
    checkFileExists(adminTypesPath, 'Admin TypeScript interfaces')
  ].every(Boolean);
  
  if (!filesExist) {
    console.log(`\n${colors.red}Some required files are missing. Please check the errors above.${colors.reset}`);
    allPassed = false;
  } else {
    console.log(`\n${colors.green}All required files exist.${colors.reset}`);
    
    // Check AdSubmissionsList component structure
    const adSubmissionsListChecks = [
      checkFileContains(adSubmissionsListPath, 'interface AdSubmissionsListProps', 'AdSubmissionsList has props interface'),
      checkFileContains(adSubmissionsListPath, 'onViewSubmission', 'AdSubmissionsList has view submission handler'),
      checkFileContains(adSubmissionsListPath, 'onApproveSubmission', 'AdSubmissionsList has approve submission handler'),
      checkFileContains(adSubmissionsListPath, 'onRejectSubmission', 'AdSubmissionsList has reject submission handler'),
      checkFileContains(adSubmissionsListPath, 'TablePagination', 'AdSubmissionsList has pagination'),
      checkFileContains(adSubmissionsListPath, 'filters', 'AdSubmissionsList has filtering functionality')
    ].every(Boolean);
    
    // Check AdManagement component integration
    const adManagementChecks = [
      checkFileContains(adManagementPath, 'import AdSubmissionsList', 'AdManagement imports AdSubmissionsList'),
      checkFileContains(adManagementPath, 'handleViewSubmission', 'AdManagement has view submission handler'),
      checkFileContains(adManagementPath, 'handleApproveSubmission', 'AdManagement has approve submission handler'),
      checkFileContains(adManagementPath, 'handleRejectSubmission', 'AdManagement has reject submission handler'),
      checkFileContains(adManagementPath, 'Dialog', 'AdManagement has submission details dialog')
    ].every(Boolean);
    
    // Check Admin TypeScript interfaces
    const adminTypesChecks = [
      checkFileContains(adminTypesPath, 'interface AdSubmission', 'Admin types has AdSubmission interface'),
      checkFileContains(adminTypesPath, 'type AdStatus', 'Admin types has AdStatus type'),
      checkFileContains(adminTypesPath, 'interface AdSubmissionFilters', 'Admin types has AdSubmissionFilters interface')
    ].every(Boolean);
    
    if (!adSubmissionsListChecks || !adManagementChecks || !adminTypesChecks) {
      console.log(`\n${colors.red}Some component structure checks failed. Please check the errors above.${colors.reset}`);
      allPassed = false;
    }
  }
  
  // Final result
  console.log(`\n${colors.bright}${colors.cyan}=== Test Results ====${colors.reset}`);
  if (allPassed) {
    console.log(`${colors.bright}${colors.green}All tests passed! The Ad Management components are properly implemented.${colors.reset}`);
  } else {
    console.log(`${colors.bright}${colors.red}Some tests failed. Please fix the issues above.${colors.reset}`);
  }
}

// Run the tests
runTests();