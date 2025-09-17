// scripts/extract_artifacts.js
const fs = require('fs');
const path = require('path');

const artifactsDir = path.join(__dirname, '..', 'artifacts', 'contracts');
const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(full, 'utf8'));
      if (data.abi && data.bytecode) {
        const name = path.basename(full, '.json');
        fs.writeFileSync(path.join(buildDir, name + '.abi.json'), JSON.stringify(data.abi, null, 2));
        fs.writeFileSync(path.join(buildDir, name + '.bin'), data.bytecode);
        console.log('Exported', name);
      }
    }
  }
}

if (fs.existsSync(artifactsDir)) walk(artifactsDir);
else { console.error('Artifacts directory not found. Run `npx hardhat compile` first.'); process.exit(1); }
