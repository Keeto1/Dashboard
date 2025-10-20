# 🎯 Backend Best Practices Guide

## 📚 Essential Backend Concepts

### 1. Database Design

#### ✅ DO:
- **Normalize data** - Avoid duplication
- **Use indexes** - Speed up queries
- **Plan for scale** - Think about millions of records
- **Version your schema** - Track database changes

```javascript
// Good: Normalized structure
users/
  {userId}/
    name, email, role
    
orders/
  {orderId}/
    userId (reference)
    items, total

// Bad: Denormalized (data duplication)
orders/
  {orderId}/
    userId, userName, userEmail  // Duplicated user data
```

#### ❌ DON'T:
- Store arrays that grow infinitely
- Use deep nesting (>3 levels)
- Forget to add timestamps
- Skip data validation

### 2. Security Rules

#### ✅ DO:
```javascript
// Good: Specific rules
allow read: if isAuthenticated() && isOwner(userId)
allow write: if isAdmin() && request.resource.data.keys().hasAll(['name', 'email'])
```

#### ❌ DON'T:
```javascript
// Bad: Open to everyone
allow read, write: if true

// Bad: No validation
allow write: if request.auth != null
```

### 3. API Design

#### RESTful Principles

```
GET    /users          - List all users
GET    /users/:id      - Get one user
POST   /users          - Create user
PUT    /users/:id      - Update user (full)
PATCH  /users/:id      - Update user (partial)
DELETE /users/:id      - Delete user
```

#### Status Codes
```
200 - OK
201 - Created
204 - No Content
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
422 - Validation Error
500 - Server Error
```

### 4. Data Validation

#### ✅ DO:
```javascript
function validateUser(data) {
  const errors = []
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Invalid email')
  }
  
  if (!data.name || data.name.length < 2) {
    errors.push('Name too short')
  }
  
  if (errors.length > 0) {
    throw new ValidationError(errors)
  }
}
```

#### Client + Server Validation
- Client: Quick feedback
- Server: Security (never trust client)

### 5. Error Handling

#### ✅ Good Error Response
```javascript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Email already exists" },
      { "field": "password", "message": "Password too weak" }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123abc"
  }
}
```

### 6. Authentication & Authorization

#### Authentication: "Who are you?"
```javascript
// JWT Token
const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '7d' })

// Store in httpOnly cookie (more secure than localStorage)
res.cookie('token', token, { 
  httpOnly: true, 
  secure: true,
  sameSite: 'strict' 
})
```

#### Authorization: "What can you do?"
```javascript
function checkPermission(user, action, resource) {
  if (user.role === 'admin') return true
  if (user.role === 'user' && resource.ownerId === user.id) return true
  return false
}
```

### 7. Performance Optimization

#### Database Queries
```javascript
// ❌ Bad: N+1 query problem
const users = await getUsers()
for (let user of users) {
  user.orders = await getOrders(user.id)  // Multiple queries!
}

// ✅ Good: Single query with join
const users = await getUsersWithOrders()  // One query
```

#### Caching
```javascript
// Cache frequently accessed data
const cache = new Map()

async function getUser(id) {
  if (cache.has(id)) {
    return cache.get(id)  // Return from cache
  }
  
  const user = await db.users.get(id)
  cache.set(id, user, { ttl: 300 })  // Cache for 5 minutes
  return user
}
```

#### Pagination
```javascript
// ✅ Always paginate large datasets
GET /users?page=1&limit=50

{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "totalPages": 20
  }
}
```

### 8. Real-time Data

#### When to Use
- ✅ Chat applications
- ✅ Live dashboards
- ✅ Collaborative editing
- ✅ Real-time notifications

#### When NOT to Use
- ❌ Static content
- ❌ Reports (use polling)
- ❌ Historical data

```javascript
// Firebase real-time listener
onSnapshot(collection(db, 'orders'), (snapshot) => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      console.log('New order:', change.doc.data())
    }
  })
})

// Unsubscribe when component unmounts
return () => unsubscribe()
```

### 9. File Uploads

```javascript
// ✅ Good practices
- Validate file type and size on client AND server
- Generate unique filenames (UUID)
- Store metadata in database
- Use CDN for serving files
- Implement virus scanning for production

// File upload flow
1. Client validates (type, size)
2. Get signed upload URL from backend
3. Upload directly to storage (S3, Firebase Storage)
4. Save file metadata in database
5. Return public URL to client
```

### 10. Logging & Monitoring

```javascript
// Structure logs
{
  "level": "error",
  "message": "Failed to process payment",
  "userId": "user123",
  "orderId": "order456",
  "error": "Insufficient funds",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123"
}

// What to log:
✅ Errors and exceptions
✅ Authentication attempts
✅ Important state changes
✅ Performance metrics

// What NOT to log:
❌ Passwords
❌ Credit card numbers
❌ Personal data (GDPR)
❌ API keys
```

### 11. Rate Limiting

```javascript
// Prevent abuse
const rateLimit = {
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100  // Max 100 requests per window
}

// Different limits for different endpoints
POST /login      - 5 requests/15min
GET  /dashboard  - 100 requests/15min
POST /api/*      - 50 requests/15min
```

### 12. Database Transactions

```javascript
// ✅ Use transactions for related operations
const batch = db.batch()

// Deduct from sender
batch.update(senderRef, { balance: senderBalance - amount })

// Add to receiver
batch.update(receiverRef, { balance: receiverBalance + amount })

// Create transaction record
batch.set(transactionRef, { from, to, amount })

// Commit all or nothing
await batch.commit()
```

## 🔐 Security Checklist

- [ ] **Input validation** - Never trust user input
- [ ] **SQL injection protection** - Use parameterized queries
- [ ] **XSS protection** - Sanitize output
- [ ] **CSRF protection** - Use tokens
- [ ] **Rate limiting** - Prevent abuse
- [ ] **HTTPS only** - Encrypt data in transit
- [ ] **Environment variables** - Never hardcode secrets
- [ ] **Principle of least privilege** - Minimal permissions
- [ ] **Regular backups** - Test restore process
- [ ] **Security headers** - CORS, CSP, etc.

## 📊 Performance Checklist

- [ ] **Database indexes** - On frequently queried fields
- [ ] **Connection pooling** - Reuse database connections
- [ ] **Caching** - Redis for hot data
- [ ] **CDN** - For static assets
- [ ] **Compression** - Gzip responses
- [ ] **Lazy loading** - Don't fetch everything upfront
- [ ] **Pagination** - Limit result sets
- [ ] **Async operations** - Don't block
- [ ] **Load balancing** - Distribute traffic
- [ ] **Monitoring** - Track performance metrics

## 🧪 Testing

```javascript
// Unit tests
test('createUser validates email', () => {
  expect(() => createUser({ email: 'invalid' }))
    .toThrow('Invalid email')
})

// Integration tests
test('user can place order', async () => {
  const user = await createUser(userData)
  const order = await placeOrder(user.id, orderData)
  expect(order.status).toBe('pending')
})

// Load tests
// Can your API handle 1000 requests/second?
```

## 📈 Scalability

### Vertical Scaling (Scale Up)
- Add more CPU/RAM to server
- Limit: Single server capacity

### Horizontal Scaling (Scale Out)
- Add more servers
- Better for high traffic
- Requires load balancer

```
User Request
     ↓
Load Balancer
     ↓
Server 1  Server 2  Server 3
     ↓        ↓        ↓
      Database Cluster
```

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate installed
- [ ] Monitoring enabled
- [ ] Backups scheduled
- [ ] Error tracking configured (Sentry)
- [ ] Health check endpoint working
- [ ] Rollback plan ready
- [ ] Load testing completed
- [ ] Documentation updated

## 📚 Recommended Reading

- **Database Design:** "Designing Data-Intensive Applications"
- **API Design:** REST API Design Rulebook
- **Security:** OWASP Top 10
- **Performance:** High Performance Browser Networking
- **Architecture:** System Design Primer

## 🛠️ Tools

- **API Testing:** Postman, Insomnia
- **Database:** TablePlus, pgAdmin
- **Monitoring:** Datadog, New Relic
- **Logging:** Logtail, Papertrail
- **Error Tracking:** Sentry
- **Load Testing:** k6, Apache JMeter

Remember: **Start simple, optimize later. Make it work, then make it fast.**
