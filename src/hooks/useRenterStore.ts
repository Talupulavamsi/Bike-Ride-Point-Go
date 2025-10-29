
import { useState, useCallback, useEffect } from 'react';
import { useAppStore } from './useAppStore';
import { useFirebase } from '@/contexts/FirebaseContext';

export interface RenterBooking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: 'bike' | 'scooter' | 'car';
  ownerName: string;
  ownerId: string;
  startDate: Date;
  endDate: Date;
  pickupTime: string;
  duration: string;
  totalAmount: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  location: string;
  bookingDate: string;
}

export interface Renter {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalRides: number;
  totalSpent: number;
  averageRating: number;
}

const STORAGE_KEYS = {
  renter: 'renter_profile'
};

export const useRenterStore = () => {
  const [renter, setRenter] = useState<Renter | null>(null);
  const { getBookingsByRenter, createBooking, completeRide } = useAppStore();
  const { user, userProfile, updateProfile } = useFirebase();

  // Load renter data from Firebase user profile (works even if user is also an owner)
  useEffect(() => {
    if (user && userProfile) {
      setRenter({
        id: userProfile.uid,
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || '',
        totalRides: userProfile.totalRides || 0,
        totalSpent: userProfile.totalSpent || 0,
        averageRating: userProfile.averageRating || 0,
      });
    } else {
      setRenter(null);
    }
  }, [user, userProfile]);

  const addBooking = useCallback(async (bookingData: Omit<RenterBooking, 'id' | 'bookingDate'>) => {
    if (!renter) return null;

    const newBooking = await createBooking({
      ...bookingData,
      renterId: renter.id,
      renterName: renter.name
    });

    // Update renter stats in profile (persisted)
    const nextRides = (userProfile?.totalRides || 0) + 1;
    const nextSpent = (userProfile?.totalSpent || 0) + bookingData.totalAmount;
    await updateProfile({ totalRides: nextRides, totalSpent: nextSpent });

    // Update local state view
    setRenter(prev => prev ? {
      ...prev,
      totalRides: nextRides,
      totalSpent: nextSpent
    } : prev);

    return newBooking;
  }, [createBooking, renter, updateProfile, userProfile]);

  const updateBookingStatus = useCallback((bookingId: string, status: 'upcoming' | 'active' | 'completed' | 'cancelled') => {
    if (status === 'completed') {
      completeRide(bookingId);
    }
    // For other status updates, we could extend the global store if needed
  }, [completeRide]);

  // Get bookings for current renter from global state
  const bookings = renter ? getBookingsByRenter(renter.id) : [];

  const getActiveBookings = () => bookings.filter(b => b.status === 'active' || b.status === 'upcoming');
  const getBookingHistory = () => bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const stats = {
    totalBookings: bookings.length,
    activeBookings: getActiveBookings().length,
    completedBookings: getBookingHistory().length,
    totalSpent: renter?.totalSpent || 0,
    averageRating: renter?.averageRating || 0
  };

  return {
    bookings,
    renter,
    stats,
    addBooking,
    updateBookingStatus,
    getActiveBookings,
    getBookingHistory,
    setRenter
  };
};
