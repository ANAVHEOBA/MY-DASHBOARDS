# Dashboard API Documentation

## Overview
Backend API documentation 

## Base URL
http://localhost:3000/api

## Authentication
All requests require Bearer token authentication:
Authorization: Bearer <token>

## Rate Limiting
- Standard endpoints: 100 requests/minute
- Real-time endpoints: 300 requests/minute
- Export endpoints: 10 requests/minute

## API Endpoints

1. USERS

GET /users
Description: Retrieve all users with optional filtering
Query Parameters:
- timeRange (optional): '24h' | '7d' | '30d'
- status (optional): 'active' | 'inactive'
- search (optional): string
Response:
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "registrationDate": "ISO-8601 date",
      "lastLoginDate": "ISO-8601 date",
      "accountStatus": "active" | "inactive",
      "onlineStatus": "online" | "offline",
      "totalSessions": number,
      "lastSessionDate": "ISO-8601 date",
      "reportedIssues": number,
      "verificationStatus": "verified" | "unverified",
      "loginAttempts": number,
      "deviceInfo": string,
      "location": string
    }
  ]
}

GET /users/metrics
Description: Get user metrics and statistics
Query Parameters:
- timeRange: '24h' | '7d' | '30d'
Response:
{
  "totalActive": number,
  "newToday": number,
  "currentlyOnline": number,
  "reportedIssues": number
}

GET /users/{userId}
Description: Get single user details
Response: Single user object

POST /users/{userId}/flag
Description: Flag a user for review
Request Body:
{
  "reason": "string"
}

GET /users/export
Description: Export users data
Query Parameters:
- timeRange (optional): '24h' | '7d' | '30d'
- format (optional): 'csv' | 'pdf'
Response: Blob (file download)

PATCH /users/{userId}/status
Description: Update user status
Request Body:
{
  "status": "active" | "inactive"
}

2. ANALYTICS

GET /analytics
Description: Get analytics data
Query Parameters:
- start: "ISO-8601 date"
- end: "ISO-8601 date"
Response:
{
  "metrics": {
    "totalUsers": number,
    "activeUsers": number,
    "averageSessionDuration": number,
    "peakConcurrentUsers": number
  },
  "trends": {
    "daily": [
      {
        "date": "ISO-8601 date",
        "users": number,
        "sessions": number
      }
    ]
  }
}

GET /analytics/realtime
Description: Get real-time metrics
Response:
{
  "currentUsers": number,
  "activeSessions": number,
  "lastMinuteRequests": number,
  "systemLoad": number
}

GET /analytics/export
Description: Export analytics data
Query Parameters:
- format: 'CSV' | 'PDF'
- start: "ISO-8601 date"
- end: "ISO-8601 date"
Response: Blob (file download)

## Error Responses

400 Bad Request
{
  "error": "Bad Request",
  "message": "Invalid parameters",
  "details": {}
}

401 Unauthorized
{
  "error": "Unauthorized",
  "message": "Authentication required"
}

403 Forbidden
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}

404 Not Found
{
  "error": "Not Found",
  "message": "Resource not found"
}

500 Internal Server Error
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}

## Data Types

User Object:
{
  id: string;
  name: string;
  email: string;
  registrationDate: string; // ISO-8601
  lastLoginDate: string; // ISO-8601
  accountStatus: 'active' | 'inactive';
  onlineStatus: 'online' | 'offline';
  totalSessions: number;
  lastSessionDate: string | null; // ISO-8601
  reportedIssues: number;
  verificationStatus: 'verified' | 'unverified';
  loginAttempts: number;
  deviceInfo: string;
  location: string;
}

Metrics Object:
{
  totalActive: number;
  newToday: number;
  currentlyOnline: number;
  reportedIssues: number;
}

3. LISTENERS

GET /listeners/monitor
Description: Retrieve all listeners with optional filtering
Query Parameters:
- timeRange (optional): '24h' | '7d' | '30d'
- status (optional): 'online' | 'offline' | 'in-session'
- specialty (optional): string
- search (optional): string
Response:
{
  "listeners": [
    {
      "id": "string",
      "name": "string",
      "specialties": string[],
      "languages": string[],
      "availabilityStatus": "online" | "offline" | "in-session",
      "sessionsConducted": number,
      "averageRating": number,
      "currentSession": {
        "userId": "string",
        "userName": "string",
        "startTime": "ISO-8601 date",
        "duration": number
      },
      "lastActive": "ISO-8601 date",
      "responseRate": number,
      "reportedIssues": number,
      "verificationStatus": "verified" | "pending" | "unverified",
      "performanceMetrics": {
        "satisfactionScore": number,
        "completionRate": number,
        "averageSessionDuration": number
      }
    }
  ]
}

GET /listeners/metrics
Description: Get listener metrics and statistics
Query Parameters:
- timeRange: '24h' | '7d' | '30d'
Response:
{
  "totalActive": number,
  "currentlyInSession": number,
  "averageResponseTime": number,
  "totalSessions": number,
  "averageRating": number,
  "totalReportedIssues": number
}

GET /listeners/{listenerId}
Description: Get single listener details
Response: Single listener object

PATCH /listeners/{listenerId}/status
Description: Update listener availability status
Request Body:
{
  "status": "online" | "offline" | "in-session"
}

POST /listeners/{listenerId}/report
Description: Report an issue with a listener
Request Body:
{
  "reason": "string"
}

## Data Types

Listener Object:
{
  id: string;
  name: string;
  specialties: string[];
  languages: string[];
  availabilityStatus: 'online' | 'offline' | 'in-session';
  sessionsConducted: number;
  averageRating: number;
  currentSession?: {
    userId: string;
    userName: string;
    startTime: string; // ISO-8601
    duration: number;
  };
  lastActive: string; // ISO-8601
  responseRate: number;
  reportedIssues: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  performanceMetrics: {
    satisfactionScore: number;
    completionRate: number;
    averageSessionDuration: number;
  };
}

ListenerMetrics Object:
{
  totalActive: number;
  currentlyInSession: number;
  averageResponseTime: number;
  totalSessions: number;
  averageRating: number;
  totalReportedIssues: number;
}