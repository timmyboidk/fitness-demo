# Backend API Specification

This document outlines the API contracts required for the frontend implementation of Authentication, Library Management, and AI Move Scoring.

> **Note:** The current implementation uses Expo Router API Routes. The base URL is relative `/api` in development or the deployed domain.

## 1. Authentication (`/api/auth`)

The Auth API uses a single `POST` endpoint with a `type` parameter to handle different authentication methods.

**Endpoint:** `POST /api/auth`

### 1.1 Phone Login / Registration
**Request Body:**
```json
{
  "type": "login_phone",
  "payload": {
    "phone": "13800138000",
    "code": "1234" // Mocked, any code works for demo if logic allows
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "u_123",
    "nickname": "User 8000",
    "phone": "13800138000",
    "token": "..." 
  }
}
```

### 1.2 WeChat Login
**Request Body:**
```json
{
  "type": "login_wechat",
  "payload": {
    "code": "wx_code_xyz"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "u_wx_123",
    "nickname": "WeChat User",
    "avatar": "http://..."
  }
}
```

---

## 2. Library Management (`/api/library`)

Manages fetching global library content and syncing user data.

### 2.1 Fetch Library
**Endpoint:** `GET /api/library`

**Response:**
```json
{
  "moves": [
    { "name": "Squat", "category": "Legs", ... }
  ],
  "sessions": [
    { "name": "Full Body", ... }
  ]
}
```

### 2.2 Add Item to User Library
**Endpoint:** `POST /api/library`

**Request Body:**
```json
{
  "type": "add_item",
  "payload": {
    "userId": "u_123",
    "itemId": "m_squat",
    "itemType": "move" // or 'session'
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": { ...updated_user_object }
}
```

---

## 3. AI Move Scoring (`/api/ai`) - *Planned*

### 3.1 Score Move
**Endpoint:** `POST /api/ai/score`

**Request Body:**
```json
{
  "moveId": "move_squat_01",
  "data": { "keypoints": [...] }
}
```

**Response:**
```json
{
  "success": true,
  "score": 85,
  "feedback": [...]
}
```
