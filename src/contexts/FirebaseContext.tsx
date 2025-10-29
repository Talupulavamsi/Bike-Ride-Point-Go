import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'owner';
  kycCompleted: boolean;
  createdAt: string;
  // Role-specific fields
  aadhaar?: string;
  license?: string;
  location?: string;
  // Owner-specific fields
  totalVehicles?: number;
  totalEarnings?: number;
  averageRating?: number;
  // User-specific fields
  totalRides?: number;
  totalSpent?: number;
}

type User = { uid: string; email: string } | null;

interface FirebaseContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profileData: Omit<UserProfile, 'uid' | 'createdAt'>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // In-memory provider: no backend session, start unauthenticated
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const baseUser: User = { uid: fbUser.uid, email: fbUser.email || '' };
        setUser(baseUser);
        const ref = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserProfile(snap.data() as UserProfile);
        } else {
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    toast({ title: 'Signed in', description: 'You are now signed in.' });
  };

  const signUp = async (email: string, password: string, profileData: Omit<UserProfile, 'uid' | 'createdAt'>) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    const completeProfileData: UserProfile = {
      uid,
      createdAt: new Date().toISOString(),
      ...profileData,
      ...(profileData.role === 'owner'
        ? { totalVehicles: 0, totalEarnings: 0, averageRating: 5.0 }
        : { totalRides: 0, totalSpent: 0 }),
    };
    await setDoc(doc(db, 'users', uid), completeProfileData);
    setUser({ uid, email });
    setUserProfile(completeProfileData);
    toast({ title: 'Account created', description: `Welcome as ${profileData.role}.` });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, updates as Record<string, unknown>);
    setUserProfile(prev => (prev ? { ...prev, ...updates } : prev));
    toast({ title: 'Profile updated', description: 'Your profile has been updated.' });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    toast({ title: 'Signed out', description: 'You have been signed out.' });
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    logout,
    updateProfile
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
