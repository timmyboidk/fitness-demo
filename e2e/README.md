# FITBODY E2E Testing Guide

This project uses **Maestro** for automated end-to-end testing on the iOS Simulator.

## Prerequisites
- **Maestro CLI**: Installed automatically by the run script, or manually via `curl -fsSL "https://get.maestro.mobile.dev" | bash`.
- **Java 11+**: Required for Maestro.
- **Xcode & iOS Simulator**: An iPhone 17 Pro Max simulator is currently being used for testing.

## Running Tests
To run the full E2E suite (Build + Install + Test):
```bash
npm run test:e2e
```

Or run individual Maestro flows:
```bash
maestro test e2e/register_flow.yaml
maestro test e2e/workout_flow.yaml
```

## Flow Definitions
- `e2e/register_flow.yaml`: Tests user registration, nickname setup, and fitness difficulty onboarding.
- `e2e/workout_flow.yaml`: Tests starting a workout, pausing/playing, and adjusting settings via the AI overlay.

## How it works
1. **testIDs**: We added `testID` props to key UI elements (`phone-input`, `login-button`, `play-pause-button`, etc.) to make them easily targetable by Maestro.
2. **Automated script**: `run_automated_tests.sh` handles the tool installation and app deployment to the simulator.
