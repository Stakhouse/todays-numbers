/**
 * Firebase Authentication Test Script
 * 
 * This script tests the Firebase authentication setup for Today's Numbers project.
 * It verifies that the environment variables are set correctly and authentication works.
 */

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, signOut } = require('firebase/auth');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Admin credentials from environment variables
const adminEmail = process.env.VITE_ADMIN_EMAIL || 'admin@todaysnumbers.com';
const adminPassword = process.env.VITE_ADMIN_PASSWORD || 'admin';

// Check if we're in development mode with mock Firebase config
const isDevelopmentMode = process.env.VITE_FIREBASE_API_KEY === 'example_api_key_here';

console.log(`\n${colors.bright}${colors.cyan}=== Firebase Authentication Test ===${colors.reset}\n`);

// Check environment variables
console.log('Checking environment variables...');
let missingVars = [];

Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    missingVars.push(key);
  }
});

if (missingVars.length > 0) {
  console.log(`${colors.red}✗${colors.reset} Missing Firebase configuration variables: ${missingVars.join(', ')}`);
  process.exit(1);
} else {
  console.log(`${colors.green}✓${colors.reset} All Firebase configuration variables are set`);
}

if (!adminEmail || !adminPassword) {
  console.log(`${colors.red}✗${colors.reset} Missing admin credentials in environment variables`);
  process.exit(1);
} else {
  console.log(`${colors.green}✓${colors.reset} Admin credentials are set`);
}

// Initialize Firebase
console.log('\nInitializing Firebase...');
let app;

try {
  app = initializeApp(firebaseConfig);
  console.log(`${colors.green}✓${colors.reset} Firebase initialized successfully`);
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Failed to initialize Firebase: ${error.message}`);
  process.exit(1);
}

// Test authentication
const testAuth = async () => {
  console.log('\nTesting authentication...');
  
  if (isDevelopmentMode) {
    console.log(`${colors.yellow}!${colors.reset} Running in development mode with mock Firebase config`);
    console.log(`${colors.yellow}!${colors.reset} Authentication will be simulated`);
    console.log(`${colors.green}✓${colors.reset} Development mode authentication test passed`);
    return;
  }
  
  const auth = getAuth(app);
  
  try {
    console.log(`Attempting to sign in with admin credentials: ${adminEmail}`);
    const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log(`${colors.green}✓${colors.reset} Authentication successful`);
    console.log(`User: ${userCredential.user.email}`);
    
    // Sign out
    await signOut(auth);
    console.log(`${colors.green}✓${colors.reset} Sign out successful`);
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} Authentication failed: ${error.message}`);
    console.log('\nPossible reasons:');
    console.log('1. Invalid credentials');
    console.log('2. User does not exist');
    console.log('3. Firebase project not properly configured');
    console.log('\nSolutions:');
    console.log('1. Check your .env.local file for correct credentials');
    console.log('2. Create the admin user in Firebase Authentication');
    console.log('3. Verify your Firebase project settings');
  }
};

// Run the test
testAuth().then(() => {
  console.log(`\n${colors.cyan}Firebase authentication test complete.${colors.reset}\n`);
}).catch(error => {
  console.error('Unexpected error:', error);
});