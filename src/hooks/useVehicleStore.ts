
import { useState, useCallback, useEffect } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useAppStore } from './useAppStore';

export interface Vehicle {
  id: string;
  name: string;
  type: 'bike' | 'scooter' | 'car';
  price: number;
  location: string;
  isAvailable: boolean;
  rating: number;
  totalBookings: number;
  totalEarnings: number;
  lastBooked: string;
  image?: string;
  gpsStatus: 'active' | 'inactive';
  ownerId: string;
}

export interface Booking {
  id: string;
  renterId: string;
  renterName: string;
  vehicleId: string;
  vehicleName: string;
  pickupTime: string;
  duration: string;
  amount: string;
  status: 'active' | 'upcoming' | 'completed';
  startTime: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaar: string;
  license: string;
  location: string;
  joinDate: string;
  verified: boolean;
}

export const useVehicleStore = () => {
  const { user, userProfile } = useFirebase();
  const { vehicles: allVehicles, bookings: allBookings, addVehicle } = useAppStore();

  // Filter vehicles and bookings for current owner
  const vehicles = user && userProfile?.role === 'owner' 
    ? allVehicles.filter(v => v.ownerId === user.uid)
    : [];

  const bookings = user && userProfile?.role === 'owner'
    ? allBookings.filter(b => b.ownerId === user.uid)
    : [];

  // Use userProfile as owner data
  const owner = userProfile?.role === 'owner' ? {
    id: userProfile.uid,
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone || '',
    aadhaar: userProfile.aadhaar || '****-****-1234',
    license: userProfile.license || 'KA02-****-5678',
    location: userProfile.location || 'Bangalore, Karnataka',
    joinDate: 'January 2024',
    verified: userProfile.kycCompleted
  } : null;

  const removeVehicle = useCallback((vehicleId: string) => {
    // In a real app, this would call a global remove function
    console.log('Remove vehicle:', vehicleId);
  }, []);

  const updateVehicle = useCallback((vehicleId: string, updates: Partial<Vehicle>) => {
    // In a real app, this would call a global update function
    console.log('Update vehicle:', vehicleId, updates);
  }, []);

  const addBooking = useCallback((bookingData: Omit<Booking, 'id'>) => {
    // This is handled by the global store now
    console.log('Add booking:', bookingData);
  }, []);

  const updateBookingStatus = useCallback((bookingId: string, status: Booking['status']) => {
    // This is handled by the global store now
    console.log('Update booking status:', bookingId, status);
  }, []);

  const stats = {
    totalVehicles: vehicles.length,
    totalEarnings: vehicles.reduce((sum, v) => sum + v.totalEarnings, 0),
    totalBookings: vehicles.reduce((sum, v) => sum + v.totalBookings, 0),
    averageRating: vehicles.length > 0 
      ? (vehicles.reduce((sum, v) => sum + v.rating, 0) / vehicles.length).toFixed(1)
      : '0.0',
    activeBookings: bookings.filter(b => b.status === 'active').length,
    availableVehicles: vehicles.filter(v => v.isAvailable).length
  };

  return {
    vehicles,
    bookings,
    owner,
    stats,
    addVehicle,
    removeVehicle,
    updateVehicle,
    addBooking,
    updateBookingStatus,
    setOwner: () => {} // Not needed with Firebase context
  };
};
