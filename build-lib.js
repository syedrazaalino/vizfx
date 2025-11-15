#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('Building library types...');
execSync('npm run build:lib:types', { stdio: 'inherit' });

console.log('Building library JS...');
execSync('npm run build:lib:js', { stdio: 'inherit' });

console.log('Library build complete!');
