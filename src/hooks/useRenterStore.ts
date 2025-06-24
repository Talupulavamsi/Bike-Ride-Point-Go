
import { useState, useCallback, useEffect } from 'react';

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
  bookings: 'renter_bookings',
  renter: 'renter_profile'
};

export const useRenterStore = () => {
  const [bookings, setBookings] = useState<RenterBooking[]>([]);
  const [renter, setRenter] = useState<Renter | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem(STORAGE_KEYS.bookings);
    const savedRenter = localStorage.getItem(STORAGE_KEYS.renter);

    if (savedBookings) {
      const parsedBookings = JSON.parse(savedBookings);
      // Convert date strings back to Date objects
      const bookingsWithDates = parsedBookings.map((booking: any) => ({
        ...booking,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate)
      }));
      setBookings(bookingsWithDates);
    }

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

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = useCallback((bookingData: Omit<RenterBooking, 'id' | 'bookingDate'>) => {
    const newBooking: RenterBooking = {
      ...bookingData,
      id: Date.now().toString(),
      bookingDate: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    
    // Update renter stats
    setRenter(prev => prev ? {
      ...prev,
      totalRides: prev.totalRides + 1,
      totalSpent: prev.totalSpent + bookingData.totalAmount
    } : prev);

    return newBooking;
  }, []);

  const updateBookingStatus = useCallback((bookingId: string, status: RenterBooking['status']) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status } : b
    ));
  }, []);

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
