#!/bin/bash

# FITBODY Automated E2E Test Suite
# This script configures and runs end-to-end tests on the iOS Simulator.

set -e

# 1. Environment Check
echo "🔍 Checking environment..."
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Maestro requires Java to run."
    exit 1
fi

# 2. Check for Maestro and install if missing
MAESTRO_BIN="$HOME/.maestro/bin/maestro"
if [ ! -f "$MAESTRO_BIN" ]; then
    echo "📥 Maestro not found. Installing Maestro..."
    curl -fsSL "https://get.maestro.mobile.dev" | bash
    export PATH="$PATH:$HOME/.maestro/bin"
else
    echo "✅ Maestro is already installed."
    export PATH="$PATH:$HOME/.maestro/bin"
fi

# 3. Build and Install the App (if not already installed)
echo "🛠 Building and installing app on simulator..."
# We use -d to target the booted simulator specifically
npx expo run:ios --device "iPhone 17 Pro Max" --no-bundler || {
    echo "❌ Build failed. Please ensure the simulator is 'Booted' and Xcode is set up."
    exit 1
}

# 4. Start Metro Bundler in the background if needed
# (Assuming it might already be running or expo run:ios started it)

# 5. Run Maestro Tests
echo "🚀 Running E2E flows..."
maestro test e2e/register_flow.yaml

echo "🎉 E2E Tests Completed!"
