# Firebase Setup Guide
## Today's Numbers - Admin Dashboard

This guide walks you through setting up Firebase for the Today's Numbers Admin Dashboard.

---

## 🔥 **Firebase Console Setup**

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `todays-numbers-admin`
4. Enable Google Analytics (optional)
5. Select Analytics account or create new
6. Click **"Create project"**

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Go to **Sign-in method** tab
4. Enable **Email/Password**:
   - Toggle **Enable**
   - Click **Save**
5. Enable **Google** sign-in:
   - Toggle **Enable**
   - Enter project support email
   - Click **Save**

### Step 3: Enable Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll add security rules later)
4. Select location closest to your users
5. Click **Done**

### Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** > **"Web"** (</> icon)
4. Enter app nickname: `admin-dashboard`
5. Check **"Also set up Firebase Hosting"** (optional)
6. Click **"Register app"**
7. **Copy the firebaseConfig object** - you'll need this!

---

## ⚙️ **Local Project Configuration**

### Step 1: Add Firebase Config to Environment

1. Copy `.env.local.template` to `.env.local`:
   ```bash
   copy .env.local.template .env.local
   ```

2. Edit `.env.local` with your Firebase config values:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=todays-numbers-admin.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=todays-numbers-admin
   VITE_FIREBASE_STORAGE_BUCKET=todays-numbers-admin.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Step 2: Deploy Firestore Security Rules

1. Install Firebase CLI (if not installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in project:
   ```bash
   firebase init firestore
   ```
   - Select your project
   - Use existing `firestore.rules`
   - Use default firestore.indexes.json

4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Step 3: Add Admin Users

1. In Firebase Console, go to **Authentication** > **Users**
2. Click **"Add user"**
3. Enter admin email: `admin@todaysnumbers.com`
4. Set a secure password
5. Click **"Add user"**

**Important:** Update the ADMIN_EMAILS array in `src/context/AuthContext.tsx` with your admin email addresses.

---

## 🧪 **Testing the Setup**

### Step 1: Start Development Server
```bash
npm run dev
```

### Step 2: Test Admin Login
1. Go to `http://localhost:5173/admin/login`
2. Try logging in with your admin email
3. Should redirect to admin dashboard
4. Test logout functionality

### Step 3: Test Authentication Guards
1. Try accessing `http://localhost:5173/admin` without logging in
2. Should redirect to login page
3. Try logging in with non-admin email
4. Should show "Access denied" error

---

## 🔐 **Security Checklist**

- [x] ✅ **Firestore security rules** deployed
- [x] ✅ **Admin email whitelist** configured
- [x] ✅ **Environment variables** secured (.env.local in .gitignore)
- [x] ✅ **Authentication guards** protecting admin routes
- [x] ✅ **Session management** working properly

---

## 🚨 **Security Notes**

1. **Never commit** `.env.local` to version control
2. **Admin emails** are currently hardcoded - move to Firestore in production
3. **Test mode Firestore** is temporarily open - security rules will lock it down
4. **Google sign-in** requires authorized domains in Firebase Console
5. **HTTPS required** for Google sign-in in production

---

## 📊 **Firebase Collections Structure**

The security rules expect these collections:

```
📁 Firestore Database
├── 📄 ads (admin only)
├── 📄 users (admin only)  
├── 📄 islands (read: public, write: admin)
├── 📄 audit_logs (admin only)
├── 📄 lottery_results (read: public, write: admin)
├── 📄 sports_scores (read: public, write: admin)
├── 📄 commodity_prices (read: public, write: admin)
├── 📄 hotel_rates (read: public, write: admin)
└── 📄 events (read: public, write: admin)
```

---

## 🎯 **Next Steps**

Phase 1 Foundation is complete! Next up:

**Phase 2: Admin Layout & Navigation**
- Create AdminLayout component
- Build sidebar navigation  
- Add admin routing structure
- Implement dashboard overview

---

## 🆘 **Troubleshooting**

### Common Issues:

**"Firebase config not found"**
- Check `.env.local` exists and has correct values
- Restart dev server after adding environment variables

**"Access denied" for admin user**
- Verify email is in ADMIN_EMAILS array
- Check Firebase Authentication user exists
- Ensure user email matches exactly (case-sensitive)

**"Permission denied" in Firestore**
- Deploy security rules: `firebase deploy --only firestore:rules`
- Check user is authenticated
- Verify admin email whitelist in rules

**Build errors**
- Run `npm run type-check` to verify TypeScript
- Check all imports are correct
- Ensure Firebase packages are installed

---

**🎉 Phase 1 Complete!** Firebase foundation is solid and ready for Phase 2.
