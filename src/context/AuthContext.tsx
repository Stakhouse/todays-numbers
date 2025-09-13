import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  AuthError
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Check if we're in development mode with mock Firebase config
const isDevelopmentMode = import.meta.env.VITE_FIREBASE_API_KEY === 'example_api_key_here';

// Mock user for development
const mockUser: Partial<User> = {
  uid: 'dev-admin-user',
  email: 'admin@todaysnumbers.com',
  displayName: 'Development Admin'
};

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string, isAdminLogin?: boolean) => Promise<void>;
  signInWithGoogle: (isAdminLogin?: boolean) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Admin email whitelist - In production, this should come from Firestore
const ADMIN_EMAILS = [
  import.meta.env.VITE_ADMIN_EMAIL || 'admin@todaysnumbers.com',
  // Add more admin emails here
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // In development mode, start with no user logged in
  useEffect(() => {
    if (isDevelopmentMode) {
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }
  }, []);

  const isAdmin = currentUser ? ADMIN_EMAILS.includes(currentUser.email || '') : false;

  const signInWithEmail = async (email: string, password: string, isAdminLogin = false): Promise<void> => {
    if (isDevelopmentMode) {
      // Mock authentication for development
      if (isAdminLogin) {
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@todaysnumbers.com';
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
        
        if (email === adminEmail && password === adminPassword) {
          setCurrentUser(mockUser as User);
          return;
        } else {
          throw new Error(`Invalid admin credentials. Use ${adminEmail} / ${adminPassword}`);
        }
      } else {
        // Mock client authentication
        if (email && password && password.length >= 6) {
          const mockClientUser: Partial<User> = {
            uid: 'dev-client-user',
            email: email,
            displayName: email.split('@')[0]
          };
          setCurrentUser(mockClientUser as User);
          return;
        } else {
          throw new Error('Invalid credentials. Password must be at least 6 characters.');
        }
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if this is admin login and user is an admin
      if (isAdminLogin && !ADMIN_EMAILS.includes(userCredential.user.email || '')) {
        await signOut(auth);
        throw new Error('Access denied: Admin privileges required');
      }
      
      // For client login, any valid user can sign in
    } catch (error) {
      const authError = error as AuthError;
      console.error('Email sign-in error:', authError);
      throw new Error(authError.message || 'Failed to sign in');
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<void> => {
    if (isDevelopmentMode) {
      // Mock registration for development
      const mockNewUser: Partial<User> = {
        uid: 'dev-new-user-' + Date.now(),
        email: email,
        displayName: displayName
      };
      setCurrentUser(mockNewUser as User);
      return;
    }

    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      // Refresh the user to get updated profile
      await userCredential.user.reload();
    } catch (error) {
      const authError = error as AuthError;
      console.error('Email sign-up error:', authError);
      throw new Error(authError.message || 'Failed to create account');
    }
  };

  const signInWithGoogle = async (isAdminLogin = false): Promise<void> => {
    if (isDevelopmentMode) {
      // Mock Google authentication for development
      if (isAdminLogin) {
        setCurrentUser(mockUser as User);
      } else {
        const mockGoogleUser: Partial<User> = {
          uid: 'dev-google-user',
          email: 'user@gmail.com',
          displayName: 'Google User'
        };
        setCurrentUser(mockGoogleUser as User);
      }
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if this is admin login and user is an admin
      if (isAdminLogin && !ADMIN_EMAILS.includes(userCredential.user.email || '')) {
        await signOut(auth);
        throw new Error('Access denied: Admin privileges required');
      }
      
      // For client login, any Google user can sign in
    } catch (error) {
      const authError = error as AuthError;
      console.error('Google sign-in error:', authError);
      throw new Error(authError.message || 'Failed to sign in with Google');
    }
  };

  const logout = async (): Promise<void> => {
    if (isDevelopmentMode) {
      setCurrentUser(null);
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to log out');
    }
  };

  useEffect(() => {
    if (isDevelopmentMode) {
      // Skip Firebase auth listener in development mode
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    isLoading,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
