#!/bin/bash
# export_binaries.sh
set -e
echo "Installing dependencies..."
npm ci
echo "Compiling contracts..."
npx hardhat compile
echo "Extracting ABI and bytecode to ./build ..."
node scripts/extract_artifacts.js
echo "Done."
