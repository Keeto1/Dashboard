# Dashboard API Documentation

## Overview
This document describes the expected API endpoints and data structures for backend integration.

## Base URL
```
Production: https://api.yourdomain.com
Development: http://localhost:3000/api
```

## Authentication
All API requests should include authentication headers:
```
Authorization: Bearer {access_token}
```

## Endpoints

### Dashboard Metrics

#### GET `/dashboard/metrics`
Get overview metrics for the dashboard.

**Response:**
```json
[
  {
    "id": "revenue",
    "title": "Total Revenue",
    "value": "$45,231",
    "change": 12.5,
    "trend": "up",
    "color": "primary"
  }
]
```

#### GET `/dashboard/traffic`
Get traffic data for chart.

**Response:**
```json
[
  { "name": "Mon", "value": 120 },
  { "name": "Tue", "value": 300 }
]
```

#### GET `/dashboard/activities`
Get recent activities.

**Response:**
```json
[
  {
    "time": "10:42 AM",
    "action": "New order received",
    "user": "John Doe"
  }
]
```

#### GET `/dashboard/analytics`
Get analytics data for charts.

**Response:**
```json
{
  "revenue": [
    { "name": "Jan", "revenue": 4000 },
    { "name": "Feb", "revenue": 3000 }
  ],
  "categories": [
    { "name": "Electronics", "sales": 4000, "target": 4500 }
  ]
}
```

#### GET `/dashboard/performance`
Get performance metrics.

**Response:**
```json
[
  {
    "title": "Page Load Time",
    "value": "1.2s",
    "change": -15,
    "trend": "up",
    "status": "excellent",
    "color": "#16a34a",
    "data": [
      { "name": "1", "value": 1.8 }
    ]
  }
]
```

### Users

#### GET `/users`
Get all users.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `status` (optional): Filter by status (active/inactive)
- `search` (optional): Search term

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Admin",
      "status": "active",
      "avatar": "url",
      "initials": "JD",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50
}
```

#### GET `/users/:id`
Get user by ID.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Admin",
  "status": "active"
}
```

#### POST `/users`
Create new user.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "Manager",
  "status": "active"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "Manager",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### PUT `/users/:id`
Update user.

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "role": "Senior Manager",
  "status": "active"
}
```

#### DELETE `/users/:id`
Delete user.

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Transactions

#### GET `/transactions`
Get all transactions.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response:**
```json
{
  "transactions": [
    {
      "id": "TXN001",
      "date": "2024-01-15T10:30:00Z",
      "customer": "John Doe",
      "amount": 1250.00,
      "status": "completed",
      "type": "payment"
    }
  ],
  "total": 500,
  "page": 1,
  "limit": 50
}
```

#### GET `/transactions/:id`
Get transaction details.

#### POST `/transactions/export`
Export transactions.

**Request Body:**
```json
{
  "format": "csv",
  "filters": {
    "status": "completed",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

**Response:**
```json
{
  "downloadUrl": "https://api.yourdomain.com/downloads/transactions-2024-01.csv",
  "expiresAt": "2024-01-15T12:00:00Z"
}
```

### Settings

#### GET `/settings`
Get user settings.

**Response:**
```json
{
  "notifications": true,
  "emailAlerts": true,
  "autoSave": true,
  "language": "en",
  "timezone": "UTC",
  "theme": "light"
}
```

#### PUT `/settings`
Update settings.

**Request Body:**
```json
{
  "notifications": false,
  "emailAlerts": true,
  "language": "es",
  "theme": "dark"
}
```

### Team

#### GET `/team/members`
Get team members.

**Response:**
```json
[
  {
    "name": "John Doe",
    "role": "Product Manager",
    "initials": "JD",
    "color": "#4361ee",
    "online": true
  }
]
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting
- 100 requests per minute per user
- 1000 requests per hour per user

## Data Validation

### User Object
- `name`: Required, string, 1-100 characters
- `email`: Required, valid email format
- `role`: Required, string
- `status`: Required, enum: ['active', 'inactive']

### Transaction Object
- `amount`: Required, number, positive
- `status`: Required, enum: ['completed', 'pending', 'failed']
- `type`: Required, enum: ['payment', 'refund']

## Integration Steps

1. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   # Update VITE_API_URL with your backend URL
   ```

2. **Enable Backend Mode**
   ```javascript
   // In src/config/api.js
   export const USE_MOCK_DATA = false
   ```

3. **Add Authentication**
   - Implement JWT token storage
   - Add interceptor to api.js for auth headers
   - Handle token refresh

4. **Test Endpoints**
   - Verify all endpoints return expected data structures
   - Test error handling
   - Verify pagination

5. **Deploy**
   - Update production API URL
   - Enable HTTPS
   - Configure CORS on backend
