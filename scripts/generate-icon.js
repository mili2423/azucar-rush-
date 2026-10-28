const { execSync } = require('child_process');
const path = require('path');

const ps1Path = path.join(__dirname, 'generate-icon.ps1');
try {
  const output = execSync(`powershell -ExecutionPolicy Bypass -File "${ps1Path}"`, {
    encoding: 'utf8',
    stdio: 'inherit',
  });
  process.exit(0);
} catch (err) {
  console.error('Failed to generate icon:', err);
  process.exit(1);
}
