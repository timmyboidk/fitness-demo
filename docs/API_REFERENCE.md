# API Reference

This documentation describes the API endpoints used by the Fitness Demo Application. Since this is a frontend-first demo, these endpoints are currently mocked in `services/api/client.ts`.

## Base URL
Default: `http://10.0.0.169:8080` (Mocked in client)

---

## Authentication (`AuthService.ts`)

### Login
Authenticate a user and retrieve a JWT token.
- **Endpoint**: `POST /api/auth`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_123",
      "nickname": "Demo User",
      "token": "jwt_token...",
      "isVip": false
    }
  }
  ```

### Onboarding
Submit initial user preferences.
- **Endpoint**: `POST /api/auth/onboarding`
- **Request Body**:
  ```json
  {
    "userId": "user_123",
    "difficulty": "Beginner",
    "goals": ["Weight Loss"]
  }
  ```

### Upgrade to VIP
Process a subscription upgrade.
- **Endpoint**: `POST /api/auth` (Note: In strict REST this might be `/api/subscriptions`, but code uses `upgradeToVip` logic)
- **Request Body**:
  ```json
  {
    "action": "upgrade",
    "planId": "yearly"
  }
  ```

---

## Library (`LibraryService.ts`)

### Get Library
Fetch all available moves and sessions.
- **Endpoint**: `GET /api/library`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "moves": [ ... ],
      "sessions": [ ... ]
    }
  }
  ```

---

## AI Scoring (`AIScoringService.ts`)

### Submit Video Analysis
Send motion data for AI scoring.
- **Endpoint**: `POST /api/ai/score`
- **Request Body**:
  ```json
  {
    "moveId": "m1",
    "keypoints": [ ... ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "score": 92,
    "feedback": ["Good form"]
  }
  ```

---

## Analytics (`DataCollector.ts`)

### Collect Data
Send usage telemetry.
- **Endpoint**: `POST /api/data/collect`
- **Request Body**:
  ```json
  {
    "event": "workout_complete",
    "timestamp": 1234567890
  }
  ```
