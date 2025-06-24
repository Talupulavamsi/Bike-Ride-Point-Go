
import { useState, useCallback, useEffect } from 'react';
import { useAppStore } from './useAppStore';

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

  // Load renter data from localStorage on mount
  useEffect(() => {
    const savedRenter = localStorage.getItem(STORAGE_KEYS.renter);

    if (savedRenter) {
      setRenter(JSON.parse(savedRenter));
    } else {
      // Set default renter data
      const defaultRenter: Renter = {
        id: 'renter-1',
        name: 'Arjun Sharma',
        email: 'arjun.sharma@email.com',
        phone: '+91 98765 43210',
        totalRides: 0,
        totalSpent: 0,
        averageRating: 5.0
      };
      setRenter(defaultRenter);
      localStorage.setItem(STORAGE_KEYS.renter, JSON.stringify(defaultRenter));
    }
  }, []);

  const addBooking = useCallback((bookingData: Omit<RenterBooking, 'id' | 'bookingDate'>) => {
    if (!renter) return null;

    const newBooking = createBooking({
      ...bookingData,
      renterId: renter.id,
      renterName: renter.name
    });
    
    // Update renter stats
    setRenter(prev => prev ? {
      ...prev,
      totalRides: prev.totalRides + 1,
      totalSpent: prev.totalSpent + bookingData.totalAmount
    } : prev);

    return newBooking;
  }, [createBooking, renter]);

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
