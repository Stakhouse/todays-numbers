/**
 * Firebase Setup Script
 * 
 * This script helps initialize Firebase for Today's Numbers project.
 * It checks for proper environment variables and provides guidance on setup.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
let envExists = false;

try {
  fs.accessSync(envPath, fs.constants.F_OK);
  envExists = true;
  console.log(`${colors.green}✓${colors.reset} Found .env.local file`);
} catch (err) {
  console.log(`${colors.red}✗${colors.reset} .env.local file not found`);
}

// Check Firebase dependencies
const checkDependencies = () => {
  try {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    
    const requiredDeps = ['firebase', '@firebase/firestore', '@firebase/auth'];
    const missingDeps = [];
    
    requiredDeps.forEach(dep => {
      if (!dependencies[dep]) {
        missingDeps.push(dep);
      }
    });
    
    if (missingDeps.length === 0) {
      console.log(`${colors.green}✓${colors.reset} All Firebase dependencies installed`);
      return true;
    } else {
      console.log(`${colors.red}✗${colors.reset} Missing dependencies: ${missingDeps.join(', ')}`);
      return false;
    }
  } catch (err) {
    console.error('Error checking dependencies:', err);
    return false;
  }
};

// Check Firebase config
const checkFirebaseConfig = () => {
  if (!envExists) return false;
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missingVars = [];
  const placeholderVars = [];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      missingVars.push(varName);
    } else if (envContent.includes(`${varName}=example`) || 
               envContent.includes(`${varName}=YOUR_`)) {
      placeholderVars.push(varName);
    }
  });
  
  if (missingVars.length === 0 && placeholderVars.length === 0) {
    console.log(`${colors.green}✓${colors.reset} Firebase configuration looks good`);
    return true;
  } else {
    if (missingVars.length > 0) {
      console.log(`${colors.red}✗${colors.reset} Missing environment variables: ${missingVars.join(', ')}`);
    }
    if (placeholderVars.length > 0) {
      console.log(`${colors.yellow}!${colors.reset} Found placeholder values for: ${placeholderVars.join(', ')}`);
    }
    return false;
  }
};

// Check admin configuration
const checkAdminConfig = () => {
  if (!envExists) return false;
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const adminVars = ['VITE_ADMIN_EMAIL', 'VITE_ADMIN_PASSWORD'];
  
  const missingVars = [];
  
  adminVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length === 0) {
    console.log(`${colors.green}✓${colors.reset} Admin configuration found`);
    return true;
  } else {
    console.log(`${colors.yellow}!${colors.reset} Missing admin variables: ${missingVars.join(', ')}`);
    return false;
  }
};

// Check Firestore rules
const checkFirestoreRules = () => {
  const rulesPath = path.join(__dirname, '..', 'firestore.rules');
  
  try {
    fs.accessSync(rulesPath, fs.constants.F_OK);
    console.log(`${colors.green}✓${colors.reset} Found firestore.rules file`);
    return true;
  } catch (err) {
    console.log(`${colors.red}✗${colors.reset} firestore.rules file not found`);
    return false;
  }
};

// Run all checks
const runChecks = () => {
  console.log(`\n${colors.bright}${colors.cyan}=== Firebase Setup Check ===${colors.reset}\n`);
  
  const depsOk = checkDependencies();
  const configOk = checkFirebaseConfig();
  const adminOk = checkAdminConfig();
  const rulesOk = checkFirestoreRules();
  
  console.log('\n' + '-'.repeat(50) + '\n');
  
  if (depsOk && configOk && adminOk && rulesOk) {
    console.log(`${colors.green}${colors.bright}All Firebase setup checks passed!${colors.reset}`);
    console.log('\nYou can now run the application with:');
    console.log('  npm run dev');
  } else {
    console.log(`${colors.yellow}${colors.bright}Some Firebase setup checks failed.${colors.reset}`);
    console.log('\nPlease follow these steps to complete the setup:');
    
    if (!depsOk) {
      console.log('\n1. Install missing Firebase dependencies:');
      console.log('   npm install firebase @firebase/firestore @firebase/auth');
    }
    
    if (!envExists || !configOk) {
      console.log('\n2. Create or update your .env.local file with Firebase config:');
      console.log('   - Go to Firebase Console: https://console.firebase.google.com/');
      console.log('   - Create a new project or select existing one');
      console.log('   - Add a web app to your project');
      console.log('   - Copy the config values to your .env.local file');
    }
    
    if (!adminOk) {
      console.log('\n3. Add admin configuration to .env.local:');
      console.log('   VITE_ADMIN_EMAIL=your-admin-email@example.com');
      console.log('   VITE_ADMIN_PASSWORD=your-secure-password');
    }
    
    if (!rulesOk) {
      console.log('\n4. Create firestore.rules file in the project root');
    }
  }
  
  console.log('\n' + '-'.repeat(50) + '\n');
};

// Ask if user wants to install dependencies
const askInstallDeps = () => {
  rl.question(`\nDo you want to install Firebase dependencies? (y/n) `, answer => {
    if (answer.toLowerCase() === 'y') {
      console.log('\nInstalling Firebase dependencies...');
      try {
        execSync('npm install firebase @firebase/firestore @firebase/auth', { stdio: 'inherit' });
        console.log(`${colors.green}✓${colors.reset} Dependencies installed successfully`);
      } catch (err) {
        console.error(`${colors.red}✗${colors.reset} Failed to install dependencies`);
      }
    }
    
    askCreateEnv();
  });
};

// Ask if user wants to create .env.local template
const askCreateEnv = () => {
  if (envExists) {
    console.log('\n.env.local already exists. Skipping creation.');
    rl.close();
    return;
  }
  
  rl.question(`\nDo you want to create a .env.local template? (y/n) `, answer => {
    if (answer.toLowerCase() === 'y') {
      console.log('\nCreating .env.local template...');
      
      const envTemplate = `# Firebase Configuration - Development Environment
# This file should be created by the user and never committed to git

# Replace these with your actual Firebase project values
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# Admin configuration
VITE_ADMIN_EMAIL=admin@todaysnumbers.com
VITE_ADMIN_PASSWORD=admin
`;
      
      try {
        fs.writeFileSync(envPath, envTemplate);
        console.log(`${colors.green}✓${colors.reset} Created .env.local template`);
      } catch (err) {
        console.error(`${colors.red}✗${colors.reset} Failed to create .env.local template`);
      }
    }
    
    rl.close();
  });
};

// Main execution
runChecks();

// Ask for interactive setup
rl.question(`\nDo you want to run the interactive setup? (y/n) `, answer => {
  if (answer.toLowerCase() === 'y') {
    askInstallDeps();
  } else {
    rl.close();
  }
});

rl.on('close', () => {
  console.log(`\n${colors.cyan}Firebase setup check complete.${colors.reset}\n`);
  process.exit(0);
});