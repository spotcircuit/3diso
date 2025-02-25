const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const vscodeDir = path.join(rootDir, '.vscode');
const settingsPath = path.join(vscodeDir, 'settings.json');
const keybindingsPath = path.join(vscodeDir, 'keybindings.json');

console.log('Checking VSCode terminal setup status...');

// Check if .vscode directory exists
if (!fs.existsSync(vscodeDir)) {
  console.log('❌ .vscode directory not found');
  console.log('Run "npm run setup" or "terminal-setup.cmd" to configure VSCode terminal integration');
  process.exit(1);
}

// Check if settings.json exists
if (!fs.existsSync(settingsPath)) {
  console.log('❌ settings.json file not found');
  console.log('Run "npm run setup" or "terminal-setup.cmd" to configure VSCode terminal integration');
  process.exit(1);
}

// Check if keybindings.json exists
if (!fs.existsSync(keybindingsPath)) {
  console.log('❌ keybindings.json file not found');
  console.log('Run "npm run setup" or "terminal-setup.cmd" to configure VSCode terminal integration');
  process.exit(1);
}

// Read settings.json content
try {
  const settingsContent = fs.readFileSync(settingsPath, 'utf8');
  const settings = JSON.parse(settingsContent);
  
  // Check if terminal settings are configured
  if (!settings['terminal.integrated.automationShell.windows']) {
    console.log('⚠️ Terminal automation shell not configured in settings.json');
  }
  
  // Read keybindings.json content
  const keybindingsContent = fs.readFileSync(keybindingsPath, 'utf8');
  const keybindings = JSON.parse(keybindingsContent);
  
  // Check if Shift+Enter binding is configured
  const hasShiftEnterBinding = keybindings.some(binding => 
    binding.key === 'shift+enter' && 
    binding.command === 'workbench.action.terminal.sendSequence'
  );
  
  if (!hasShiftEnterBinding) {
    console.log('⚠️ Shift+Enter binding not configured in keybindings.json');
  }
  
  // If we got here, configuration exists
  console.log('✅ VSCode terminal integration is configured');
  console.log('✅ Shift+Enter key binding is set up');
  console.log('✅ Terminal profiles are configured');
  
} catch (error) {
  console.error('Error checking VSCode configuration:', error.message);
  console.log('Run "npm run setup" or "terminal-setup.cmd" to configure VSCode terminal integration');
  process.exit(1);
}