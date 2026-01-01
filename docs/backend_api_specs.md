# Backend API Specification

This document outlines the API contracts required for the frontend implementation of Authentication and AI Move Scoring.

## 1. Authentication (`/api/auth`)

### 1.1 Phone Number & OTP Login

#### POST `/api/auth/otp/request`
Request an OTP code to be sent to the user's phone number.

**Request Body:**
```json
{
  "phoneNumber": "+8613800138000",
  "region": "CN" // Optional, default CN
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 60 // Seconds until allowed to resend
}
```

#### POST `/api/auth/otp/verify`
Verify the OTP code and log the user in.

**Request Body:**
```json
{
  "phoneNumber": "+8613800138000",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1Ni...", // JWT Token
  "user": {
    "id": "u_123456",
    "nickname": "Tim",
    "avatar": "https://..."
  }
}
```

### 1.2 WeChat Login

#### POST `/api/auth/wechat`
Exchange the WeChat authorization code for an app token.

**Request Body:**
```json
{
  "code": "021Fw5000..." // Code received from WeChat SDK
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "u_123456",
    "nickname": "Tim",
    "avatar": "https://..."
  },
  "isNewUser": false // To trigger onboarding if needed
}
```

---

## 2. AI Move Scoring (`/api/ai`)

### 2.1 Score Move

#### POST `/api/ai/score`
Submit movement data (e.g., video frames or keypoints) for scoring.

**Request Body:**
```json
{
  "moveId": "move_squat_01",
  "sessionId": "session_leg_day_01",
  "timestamp": 1704067200,
  "data": {
    // Structure depends on model input requirements
    // Option A: Keypoints (Pose Estimation Result)
    "keypoints": [
       [0.5, 0.2, 0.9], // x, y, confidence
       ...
    ],
    // Option B: Base64 Image (Less efficient)
    "frame": "data:image/jpeg;base64,..." 
  }
}
```

**Response:**
```json
{
  "success": true,
  "score": 85, // 0-100
  "feedback": [
    {
      "type": "correction",
      "message": "Keep your back straight",
      "severity": "medium"
    },
    {
      "type": "praise",
      "message": "Good depth!"
    }
  ],
  "metrics": {
    "depth": "parallel",
    "stability": "high"
  }
}
```
