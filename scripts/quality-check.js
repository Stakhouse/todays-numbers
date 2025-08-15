#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running Today\'s Numbers Quality Checks...\n');

// Ensure we're in the right directory
process.chdir(path.resolve(__dirname, '..'));

const checks = [
  {
    name: '📝 TypeScript Compilation',
    command: 'npx tsc --noEmit',
    description: 'Checking for TypeScript compilation errors'
  },
  {
    name: '🔧 ESLint Check',
    command: 'npx eslint src --ext .ts,.tsx --max-warnings 0',
    description: 'Checking code quality with ESLint',
    optional: true
  }
];

let passedChecks = 0;
const totalChecks = checks.length;

for (const check of checks) {
  console.log(`\n${check.name}`);
  console.log(`📋 ${check.description}`);
  
  try {
    const startTime = Date.now();
    execSync(check.command, { 
      stdio: 'inherit',
      timeout: check.timeout || 120000 // 2 minutes default timeout
    });
    const duration = Date.now() - startTime;
    console.log(`✅ PASSED (${(duration/1000).toFixed(1)}s)`);
    passedChecks++;
  } catch (error) {
    console.log(`❌ FAILED`);
    if (error.status !== 124) { // Don't show timeout errors as failures for dev server
      console.error(`   Error: ${error.message}`);
    }
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`🎯 QUALITY CHECK RESULTS: ${passedChecks}/${totalChecks} PASSED`);

if (passedChecks === totalChecks) {
  console.log('🎉 All quality checks passed! Ready for development.');
  process.exit(0);
} else {
  console.log('⚠️  Some quality checks failed. Please review the errors above.');
  process.exit(1);
}
