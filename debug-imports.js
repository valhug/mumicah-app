// Test file to check imports
console.log('Testing imports...');

try {
  console.log('1. Testing @mumicah/shared import...');
  const shared = require('./packages/shared/src/index.ts');
  console.log('✓ @mumicah/shared imports successfully');
} catch (e) {
  console.log('✗ @mumicah/shared failed:', e.message);
}

try {
  console.log('2. Testing @mumicah/ui import...');
  const ui = require('./packages/ui/src/index.ts');
  console.log('✓ @mumicah/ui imports successfully');
} catch (e) {
  console.log('✗ @mumicah/ui failed:', e.message);
}

console.log('Done testing imports.');
