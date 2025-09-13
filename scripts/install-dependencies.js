/**
 * Dependency Installation Script
 * 
 * This script checks and installs required dependencies for the Today's Numbers project.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`\n${colors.bright}${colors.cyan}=== Today's Numbers Dependency Installer ===${colors.reset}\n`);

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.log(`${colors.red}✗${colors.reset} package.json not found. Make sure you're running this script from the project root.`);
  process.exit(1);
}

// Read package.json
let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Failed to parse package.json: ${error.message}`);
  process.exit(1);
}

// Check for required dependencies
const requiredDependencies = {
  'firebase': '^10.0.0',
  'dotenv': '^16.0.0'
};

const missingDependencies = [];
const outdatedDependencies = [];

Object.entries(requiredDependencies).forEach(([dep, version]) => {
  const currentVersion = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
  
  if (!currentVersion) {
    missingDependencies.push(dep);
  } else {
    // Simple version check (not handling complex semver)
    const currentMajor = parseInt(currentVersion.replace(/[^0-9]/g, '').charAt(0));
    const requiredMajor = parseInt(version.replace(/[^0-9]/g, '').charAt(0));
    
    if (currentMajor < requiredMajor) {
      outdatedDependencies.push({ name: dep, current: currentVersion, required: version });
    }
  }
});

// Install missing dependencies
if (missingDependencies.length > 0) {
  console.log(`\n${colors.yellow}!${colors.reset} Missing dependencies: ${missingDependencies.join(', ')}`);
  console.log(`\nInstalling missing dependencies...`);
  
  try {
    execSync(`npm install --save ${missingDependencies.join(' ')}`, { stdio: 'inherit' });
    console.log(`\n${colors.green}✓${colors.reset} Successfully installed missing dependencies.`);
  } catch (error) {
    console.log(`\n${colors.red}✗${colors.reset} Failed to install dependencies: ${error.message}`);
    console.log(`\nPlease install them manually using:\n\nnpm install --save ${missingDependencies.join(' ')}`);
  }
} else {
  console.log(`${colors.green}✓${colors.reset} All required dependencies are installed.`);
}

// Warn about outdated dependencies
if (outdatedDependencies.length > 0) {
  console.log(`\n${colors.yellow}!${colors.reset} Outdated dependencies:`);
  outdatedDependencies.forEach(dep => {
    console.log(`  - ${dep.name}: ${dep.current} (required: ${dep.required})`);
  });
  console.log(`\nConsider updating these dependencies using:\n\nnpm install --save ${outdatedDependencies.map(d => d.name).join(' ')}`);
}

console.log(`\n${colors.cyan}Dependency check complete.${colors.reset}\n`);