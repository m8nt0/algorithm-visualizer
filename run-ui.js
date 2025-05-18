#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the SvelteKit UI
const svelteKitPath = path.join(__dirname, 'ui', 'sveltekit');

// Create the .svelte-kit directory if it doesn't exist
const svelteKitDir = path.join(svelteKitPath, '.svelte-kit');
if (!fs.existsSync(svelteKitDir)) {
  fs.mkdirSync(svelteKitDir, { recursive: true });
}

// Create a minimal tsconfig.json in .svelte-kit
const tsConfigPath = path.join(svelteKitDir, 'tsconfig.json');
if (!fs.existsSync(tsConfigPath)) {
  fs.writeFileSync(tsConfigPath, JSON.stringify({
    compilerOptions: {
      allowJs: true,
      checkJs: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      skipLibCheck: true,
      sourceMap: true
    }
  }, null, 2));
}

console.log('Installing dependencies for SvelteKit UI...');

// Run npm install if needed
const install = spawn('npm', ['install', '--legacy-peer-deps'], {
  cwd: svelteKitPath,
  stdio: 'inherit'
});

install.on('close', (code) => {
  if (code !== 0) {
    console.error('Failed to install dependencies');
    process.exit(code);
  }
  
  console.log('Starting SvelteKit development server...');
  
  // Start the development server
  const dev = spawn('npm', ['run', 'dev', '--', '--open'], {
    cwd: svelteKitPath,
    stdio: 'inherit'
  });
  
  dev.on('close', (code) => {
    process.exit(code);
  });
}); 