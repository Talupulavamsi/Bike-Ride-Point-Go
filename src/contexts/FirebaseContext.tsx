
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // First check if user is in owners collection
          const ownerDoc = doc(db, 'owners', user.uid);
          const ownerSnap = await getDoc(ownerDoc);
          
          if (ownerSnap.exists()) {
            setUserProfile({ uid: user.uid, ...ownerSnap.data() } as UserProfile);
          } else {
            // Check users collection
            const userDoc = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDoc);
            
            if (userSnap.exists()) {
              setUserProfile({ uid: user.uid, ...userSnap.data() } as UserProfile);
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, profileData: Omit<UserProfile, 'uid' | 'createdAt'>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Prepare profile data with defaults based on role
      const completeProfileData: Omit<UserProfile, 'uid'> = {
        ...profileData,
        createdAt: new Date().toISOString(),
        ...(profileData.role === 'owner' ? {
          totalVehicles: 0,
          totalEarnings: 0,
          averageRating: 5.0
        } : {
          totalRides: 0,
          totalSpent: 0
        })
      };

      // Store in appropriate collection based on role
      const collection = profileData.role === 'owner' ? 'owners' : 'users';
      const userDoc = doc(db, collection, user.uid);
      await setDoc(userDoc, completeProfileData);

      toast({
        title: "Account created!",
        description: `Welcome to the vehicle rental platform as ${profileData.role}.`,
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;

    try {
      const collection = userProfile.role === 'owner' ? 'owners' : 'users';
      const userDoc = doc(db, collection, user.uid);
      await setDoc(userDoc, updates, { merge: true });
      
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
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
