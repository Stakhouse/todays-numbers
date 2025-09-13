# Firebase Admin Setup Guide

## Overview

This guide provides step-by-step instructions for setting up the Firebase Admin Dashboard for Today's Numbers. It covers Firebase project creation, authentication setup, Firestore configuration, and security rules implementation.

## Prerequisites

- Node.js and npm installed
- Firebase account (create one at [firebase.google.com](https://firebase.google.com))

## Setup Steps

### 1. Firebase Project Creation

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the prompts
3. Name your project (e.g., "Today's Numbers")
4. Enable Google Analytics if desired
5. Click "Create project"

### 2. Web App Registration

1. In your Firebase project, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "Today's Numbers Web")
3. Copy the Firebase configuration object

### 3. Environment Configuration

1. Create or update `.env.local` in your project root with the Firebase config:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Admin configuration
VITE_ADMIN_EMAIL=admin@todaysnumbers.com
VITE_ADMIN_PASSWORD=your_secure_password
```

### 4. Authentication Setup

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable Email/Password authentication
3. Enable Google authentication (optional)
4. Add your admin email to the authorized domains if needed

### 5. Firestore Database Setup

1. Go to "Firestore Database" in the Firebase Console
2. Click "Create database"
3. Start in production mode
4. Choose a location closest to your users

### 6. Create Collections

Create the following collections in Firestore:

- `ads` - For ad submissions
- `users` - For admin users
- `islands` - For island-specific data
- `audit_logs` - For tracking admin actions
- `lottery_results` - For lottery data
- `sports_scores` - For sports data
- `commodity_prices` - For commodity data
- `hotel_rates` - For hotel data
- `events` - For event data

### 7. Security Rules Deployment

The project includes Firestore security rules in `firestore.rules`. Deploy them using:

```bash
npm run firebase:rules
```

Or manually in the Firebase Console under "Firestore Database" > "Rules".

### 8. Admin User Creation

1. In development mode, use the credentials from your `.env.local` file
2. For production, create an admin user through Firebase Authentication
3. Update the `ADMIN_EMAILS` array in `firestore.rules` with your admin email

## Running the Setup Script

We've included a setup script to help verify your Firebase configuration:

```bash
npm run firebase:setup
```

This script will:
- Check for Firebase dependencies
- Verify your environment variables
- Confirm Firestore rules exist
- Offer to install dependencies or create templates if missing

## Deployment

To deploy your Firestore rules and application to Firebase Hosting:

```bash
npm run firebase:deploy
```

## Testing Admin Access

1. Run the application: `npm run dev`
2. Navigate to `/admin/login`
3. Log in with your admin credentials
4. You should be redirected to the Admin Dashboard

## Troubleshooting

- **Authentication Issues**: Check that your admin email is in the `ADMIN_EMAILS` array in both `AuthContext.tsx` and `firestore.rules`
- **Firestore Access Denied**: Verify your security rules are deployed correctly
- **Environment Variables**: Ensure your `.env.local` file has the correct Firebase configuration

## Next Steps

After completing the Firebase setup, proceed to Phase 2 of the Admin Dashboard implementation: Admin Layout & Navigation.