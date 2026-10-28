'use client';

import * as React from 'react';
import {
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  signOut,
  updateProfile,
} from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  authMode: 'login' | 'signup';
  setAuthModalOpen: (open: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  openLogin: () => void;
  openSignup: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const mapFirebaseUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'AURA User',
    email: firebaseUser.email || '',
    phone: firebaseUser.phoneNumber || undefined,
    avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email || 'aura-user'}`,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login');

  React.useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const nextUser = mapFirebaseUser(firebaseUser);
      setUser(nextUser);

      if (nextUser && db) {
        setDoc(
          doc(db, 'users', nextUser.id),
          { profile: JSON.parse(JSON.stringify(nextUser)), updatedAt: serverTimestamp() },
          { merge: true },
        ).catch((error) => {
          console.warn('Failed to save Firebase profile:', error);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const persistLocalSession = (sessionUser: User) => {
    setUser(sessionUser);
    localStorage.setItem('aura_user', JSON.stringify(sessionUser));
    setAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    if (auth) {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const nextUser = mapFirebaseUser(result.user);
      if (nextUser) persistLocalSession(nextUser);
      return;
    }

    const sessionUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    persistLocalSession(sessionUser);
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    if (auth) {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(result.user, { displayName: name });
      const nextUser = mapFirebaseUser(result.user);
      if (nextUser) persistLocalSession({ ...nextUser, name, phone });
      return;
    }

    const sessionUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    persistLocalSession(sessionUser);
  };

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error('Firebase is not configured. Add your Firebase credentials to .env.local.');
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const nextUser = mapFirebaseUser(result.user);
      if (nextUser) {
        persistLocalSession(nextUser);
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.warn('Firebase sign-out failed:', error);
      }
    }
    setUser(null);
    localStorage.removeItem('aura_user');
  };

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authModalOpen,
        authMode,
        setAuthModalOpen,
        setAuthMode,
        openLogin,
        openSignup,
        login,
        signup,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}