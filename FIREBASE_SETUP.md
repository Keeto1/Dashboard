# 🔥 Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `my-dashboard`
4. Enable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Register Web App

1. In Firebase Console, click the **Web** icon (</>)
2. Register app name: `Dashboard`
3. Enable Firebase Hosting (optional)
4. Click "Register app"
5. **Copy the config object**

## Step 3: Add Configuration

Create `.env` file in dashboard folder:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Email/Password** sign-in
4. (Optional) Enable other providers (Google, Facebook, etc.)

## Step 5: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create Database"
3. Choose **Production mode**
4. Select location (choose closest to your users)
5. Click "Enable"

## Step 6: Set Up Security Rules

1. In Firestore, go to **Rules** tab
2. Copy contents from `firestore.rules` file
3. Paste and click **Publish**

## Step 7: Initialize Collections

Run this script in Firestore Console or use Firebase Admin SDK:

```javascript
// Dashboard metrics
db.collection('dashboard').doc('metrics').set({
  items: [
    { id: 'revenue', title: 'Total Revenue', value: '$45,231', change: 12.5, trend: 'up', color: 'primary' },
    { id: 'users', title: 'Active Users', value: '12,543', change: 18.3, trend: 'up', color: 'success' }
  ],
  updatedAt: new Date().toISOString()
})

// Create first admin user
db.collection('users').doc('USER_ID_HERE').set({
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  status: 'active',
  createdAt: new Date().toISOString()
})
```

## Step 8: Enable Storage (Optional)

1. Go to **Storage**
2. Click "Get Started"
3. Use default security rules
4. Click "Done"

## Firestore Database Structure

```
📁 Firestore Database
│
├── 📂 users/
│   └── {userId}
│       ├── name: string
│       ├── email: string
│       ├── role: 'admin' | 'user'
│       ├── status: 'active' | 'inactive'
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── 📂 transactions/
│   └── {transactionId}
│       ├── customer: string
│       ├── amount: number
│       ├── status: 'completed' | 'pending' | 'failed'
│       ├── type: 'payment' | 'refund'
│       ├── date: timestamp
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── 📂 dashboard/
│   ├── metrics (document)
│   │   ├── items: array
│   │   └── updatedAt: timestamp
│   ├── traffic (document)
│   │   ├── data: array
│   │   └── updatedAt: timestamp
│   ├── analytics (document)
│   │   ├── revenue: array
│   │   ├── categories: array
│   │   └── updatedAt: timestamp
│   └── performance (document)
│       ├── metrics: array
│       └── updatedAt: timestamp
│
├── 📂 activities/
│   └── {activityId}
│       ├── time: string
│       ├── action: string
│       ├── user: string
│       └── timestamp: timestamp
│
├── 📂 team/
│   └── {memberId}
│       ├── name: string
│       ├── role: string
│       ├── initials: string
│       ├── color: string
│       └── online: boolean
│
└── 📂 settings/
    └── {userId}
        ├── notifications: boolean
        ├── emailAlerts: boolean
        ├── autoSave: boolean
        ├── language: string
        ├── timezone: string
        └── theme: 'light' | 'dark'
```

## Testing

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Create test user:**
   - Go to Firebase Console > Authentication
   - Add user manually or use sign-up form

3. **Test authentication:**
   - Login with created user
   - Check if token appears in browser storage

4. **Verify Firestore:**
   - Add test data in Firestore Console
   - Check if it appears in dashboard

## Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## Security Best Practices

✅ **Never commit `.env` file** - Add to `.gitignore`  
✅ **Use environment variables** - For all sensitive data  
✅ **Enable App Check** - Prevent abuse  
✅ **Set up security rules** - Protect your data  
✅ **Enable monitoring** - Track errors and usage  
✅ **Use indexes** - For complex queries  

## Common Issues

**Problem:** Firebase not initialized  
**Solution:** Check if all env variables are set

**Problem:** Permission denied  
**Solution:** Check Firestore security rules

**Problem:** Real-time not updating  
**Solution:** Check if listener is properly set up

## Next Steps

- [ ] Set up Firebase Cloud Functions for backend logic
- [ ] Add Firebase Cloud Messaging for notifications
- [ ] Configure Firebase Performance Monitoring
- [ ] Set up Crashlytics for error tracking
- [ ] Add scheduled backups

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guides](https://firebase.google.com/docs/firestore)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
