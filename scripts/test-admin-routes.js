/**
 * Admin Routes Test Script
 * 
 * This script tests the admin dashboard routing for Today's Numbers project.
 * It verifies that all admin routes are properly configured and protected.
 */

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

console.log(`\n${colors.bright}${colors.cyan}=== Admin Routes Test ===${colors.reset}\n`);

// Check if App.tsx exists
const appTsxPath = path.join(process.cwd(), 'src', 'App.tsx');
if (!fs.existsSync(appTsxPath)) {
  console.log(`${colors.red}✗${colors.reset} App.tsx not found. Make sure you're running this script from the project root.`);
  process.exit(1);
}

// Read App.tsx
let appTsxContent;
try {
  appTsxContent = fs.readFileSync(appTsxPath, 'utf8');
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Failed to read App.tsx: ${error.message}`);
  process.exit(1);
}

// Check for admin routes
console.log('Checking admin routes configuration...');

const adminRoutePatterns = [
  { name: 'Admin Layout', pattern: /AdminLayout/i },
  { name: 'Protected Route', pattern: /ProtectedRoute/i },
  { name: 'Admin Login', pattern: /path="\/admin\/login"/i },
  { name: 'Admin Dashboard', pattern: /path="\/admin\/dashboard"/i },
  { name: 'Admin Ads', pattern: /path="\/admin\/ads"/i },
  { name: 'Admin Users', pattern: /path="\/admin\/users"/i },
  { name: 'Admin Islands', pattern: /path="\/admin\/islands"/i },
  { name: 'Admin Reports', pattern: /path="\/admin\/reports"/i },
  { name: 'Admin Analytics', pattern: /path="\/admin\/analytics"/i }
];

const foundRoutes = [];
const missingRoutes = [];

adminRoutePatterns.forEach(route => {
  if (appTsxContent.match(route.pattern)) {
    foundRoutes.push(route.name);
  } else {
    missingRoutes.push(route.name);
  }
});

if (foundRoutes.length > 0) {
  console.log(`${colors.green}✓${colors.reset} Found the following admin routes:`);
  foundRoutes.forEach(route => {
    console.log(`  - ${route}`);
  });
}

if (missingRoutes.length > 0) {
  console.log(`${colors.yellow}!${colors.reset} Missing the following admin routes:`);
  missingRoutes.forEach(route => {
    console.log(`  - ${route}`);
  });
}

// Check for ProtectedRoute component
const protectedRoutePath = path.join(process.cwd(), 'src', 'components', 'auth', 'ProtectedRoute.tsx');
if (fs.existsSync(protectedRoutePath)) {
  console.log(`${colors.green}✓${colors.reset} ProtectedRoute component found`);
  
  // Read ProtectedRoute.tsx
  let protectedRouteContent;
  try {
    protectedRouteContent = fs.readFileSync(protectedRoutePath, 'utf8');
    
    // Check for authentication checks
    const hasCurrentUser = protectedRouteContent.includes('currentUser');
    const hasIsAdmin = protectedRouteContent.includes('isAdmin');
    const hasRedirect = protectedRouteContent.includes('Navigate');
    
    if (hasCurrentUser && hasIsAdmin && hasRedirect) {
      console.log(`${colors.green}✓${colors.reset} ProtectedRoute has proper authentication checks`);
    } else {
      console.log(`${colors.yellow}!${colors.reset} ProtectedRoute may be missing some authentication checks:`);
      if (!hasCurrentUser) console.log(`  - Missing currentUser check`);
      if (!hasIsAdmin) console.log(`  - Missing isAdmin check`);
      if (!hasRedirect) console.log(`  - Missing redirect for unauthenticated users`);
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} Failed to read ProtectedRoute.tsx: ${error.message}`);
  }
} else {
  console.log(`${colors.red}✗${colors.reset} ProtectedRoute component not found`);
}

// Check for AuthContext
const authContextPath = path.join(process.cwd(), 'src', 'context', 'AuthContext.tsx');
if (fs.existsSync(authContextPath)) {
  console.log(`${colors.green}✓${colors.reset} AuthContext found`);
  
  // Read AuthContext.tsx
  let authContextContent;
  try {
    authContextContent = fs.readFileSync(authContextPath, 'utf8');
    
    // Check for authentication functions
    const hasLogin = authContextContent.includes('login');
    const hasLogout = authContextContent.includes('logout');
    const hasIsAdmin = authContextContent.includes('isAdmin');
    
    if (hasLogin && hasLogout && hasIsAdmin) {
      console.log(`${colors.green}✓${colors.reset} AuthContext has proper authentication functions`);
    } else {
      console.log(`${colors.yellow}!${colors.reset} AuthContext may be missing some authentication functions:`);
      if (!hasLogin) console.log(`  - Missing login function`);
      if (!hasLogout) console.log(`  - Missing logout function`);
      if (!hasIsAdmin) console.log(`  - Missing isAdmin check`);
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} Failed to read AuthContext.tsx: ${error.message}`);
  }
} else {
  console.log(`${colors.red}✗${colors.reset} AuthContext not found`);
}

console.log(`\n${colors.cyan}Admin routes test complete.${colors.reset}\n`);