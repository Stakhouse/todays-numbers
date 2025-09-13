/**
 * Firebase Deployment Script
 * 
 * This script helps deploy Firebase configuration for Today's Numbers project.
 * It handles Firestore rules deployment and provides guidance on Firebase hosting.
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

// Check if Firebase CLI is installed
const checkFirebaseCLI = () => {
  try {
    execSync('firebase --version', { stdio: 'ignore' });
    console.log(`${colors.green}✓${colors.reset} Firebase CLI is installed`);
    return true;
  } catch (err) {
    console.log(`${colors.red}✗${colors.reset} Firebase CLI is not installed`);
    return false;
  }
};

// Check if firebase.json exists
const checkFirebaseJson = () => {
  const firebaseJsonPath = path.join(__dirname, '..', 'firebase.json');
  
  try {
    fs.accessSync(firebaseJsonPath, fs.constants.F_OK);
    console.log(`${colors.green}✓${colors.reset} Found firebase.json file`);
    return true;
  } catch (err) {
    console.log(`${colors.red}✗${colors.reset} firebase.json file not found`);
    return false;
  }
};

// Check if .firebaserc exists
const checkFirebaserc = () => {
  const firebasercPath = path.join(__dirname, '..', '.firebaserc');
  
  try {
    fs.accessSync(firebasercPath, fs.constants.F_OK);
    console.log(`${colors.green}✓${colors.reset} Found .firebaserc file`);
    return true;
  } catch (err) {
    console.log(`${colors.red}✗${colors.reset} .firebaserc file not found`);
    return false;
  }
};

// Check if Firestore rules exist
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
  console.log(`\n${colors.bright}${colors.cyan}=== Firebase Deployment Check ===${colors.reset}\n`);
  
  const cliOk = checkFirebaseCLI();
  const jsonOk = checkFirebaseJson();
  const rcOk = checkFirebaserc();
  const rulesOk = checkFirestoreRules();
  
  console.log('\n' + '-'.repeat(50) + '\n');
  
  if (cliOk && jsonOk && rcOk && rulesOk) {
    console.log(`${colors.green}${colors.bright}All Firebase deployment checks passed!${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.yellow}${colors.bright}Some Firebase deployment checks failed.${colors.reset}`);
    console.log('\nPlease follow these steps to complete the setup:');
    
    if (!cliOk) {
      console.log('\n1. Install Firebase CLI:');
      console.log('   npm install -g firebase-tools');
    }
    
    if (!jsonOk || !rcOk) {
      console.log('\n2. Initialize Firebase project:');
      console.log('   firebase login');
      console.log('   firebase init');
    }
    
    if (!rulesOk) {
      console.log('\n3. Create firestore.rules file in the project root');
    }
    
    return false;
  }
};

// Create firebase.json if it doesn't exist
const createFirebaseJson = () => {
  const firebaseJsonPath = path.join(__dirname, '..', 'firebase.json');
  
  const firebaseJson = {
    "firestore": {
      "rules": "firestore.rules",
      "indexes": "firestore.indexes.json"
    },
    "hosting": {
      "public": "dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  };
  
  try {
    fs.writeFileSync(firebaseJsonPath, JSON.stringify(firebaseJson, null, 2));
    console.log(`${colors.green}✓${colors.reset} Created firebase.json file`);
    return true;
  } catch (err) {
    console.error(`${colors.red}✗${colors.reset} Failed to create firebase.json file`);
    return false;
  }
};

// Create firestore.indexes.json if it doesn't exist
const createFirestoreIndexes = () => {
  const indexesPath = path.join(__dirname, '..', 'firestore.indexes.json');
  
  const indexesJson = {
    "indexes": [],
    "fieldOverrides": []
  };
  
  try {
    fs.writeFileSync(indexesPath, JSON.stringify(indexesJson, null, 2));
    console.log(`${colors.green}✓${colors.reset} Created firestore.indexes.json file`);
    return true;
  } catch (err) {
    console.error(`${colors.red}✗${colors.reset} Failed to create firestore.indexes.json file`);
    return false;
  }
};

// Deploy Firestore rules
const deployFirestoreRules = () => {
  console.log('\nDeploying Firestore rules...');
  
  try {
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
    console.log(`${colors.green}✓${colors.reset} Firestore rules deployed successfully`);
    return true;
  } catch (err) {
    console.error(`${colors.red}✗${colors.reset} Failed to deploy Firestore rules`);
    return false;
  }
};

// Deploy Firebase hosting
const deployHosting = () => {
  console.log('\nBuilding the application...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log(`${colors.green}✓${colors.reset} Build completed successfully`);
    
    console.log('\nDeploying to Firebase Hosting...');
    execSync('firebase deploy --only hosting', { stdio: 'inherit' });
    console.log(`${colors.green}✓${colors.reset} Deployed to Firebase Hosting successfully`);
    return true;
  } catch (err) {
    console.error(`${colors.red}✗${colors.reset} Deployment failed`);
    return false;
  }
};

// Main execution
const allChecksPass = runChecks();

if (!allChecksPass) {
  rl.question(`\nDo you want to set up Firebase deployment files? (y/n) `, answer => {
    if (answer.toLowerCase() === 'y') {
      const jsonCreated = createFirebaseJson();
      const indexesCreated = createFirestoreIndexes();
      
      if (jsonCreated && indexesCreated) {
        console.log(`\n${colors.green}${colors.bright}Firebase configuration files created!${colors.reset}`);
        console.log('\nNext steps:');
        console.log('1. Install Firebase CLI: npm install -g firebase-tools');
        console.log('2. Login to Firebase: firebase login');
        console.log('3. Initialize Firebase project: firebase init');
      }
      
      rl.close();
    } else {
      rl.close();
    }
  });
} else {
  rl.question(`\nDo you want to deploy Firestore rules? (y/n) `, answer => {
    if (answer.toLowerCase() === 'y') {
      deployFirestoreRules();
      
      rl.question(`\nDo you want to deploy to Firebase Hosting? (y/n) `, answer => {
        if (answer.toLowerCase() === 'y') {
          deployHosting();
        }
        rl.close();
      });
    } else {
      rl.close();
    }
  });
}

rl.on('close', () => {
  console.log(`\n${colors.cyan}Firebase deployment process complete.${colors.reset}\n`);
  process.exit(0);
});