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

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
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
  'admin@todaysnumbers.com',
  // Add more admin emails here
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = currentUser ? ADMIN_EMAILS.includes(currentUser.email || '') : false;

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is an admin
      if (!ADMIN_EMAILS.includes(userCredential.user.email || '')) {
        await signOut(auth);
        throw new Error('Access denied: Admin privileges required');
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Email sign-in error:', authError);
      throw new Error(authError.message || 'Failed to sign in');
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user is an admin
      if (!ADMIN_EMAILS.includes(userCredential.user.email || '')) {
        await signOut(auth);
        throw new Error('Access denied: Admin privileges required');
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Google sign-in error:', authError);
      throw new Error(authError.message || 'Failed to sign in with Google');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to log out');
    }
  };

  useEffect(() => {
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
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
