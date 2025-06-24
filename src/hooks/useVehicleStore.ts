
import { useState, useCallback, useEffect } from 'react';
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

const STORAGE_KEYS = {
  owner: 'owner_profile'
};

export const useVehicleStore = () => {
  const [owner, setOwner] = useState<Owner | null>(null);
  const { getVehiclesByOwner, getBookingsByOwner, addVehicle: addGlobalVehicle } = useAppStore();

  // Load owner data from localStorage on mount
  useEffect(() => {
    const savedOwner = localStorage.getItem(STORAGE_KEYS.owner);

    if (savedOwner) {
      setOwner(JSON.parse(savedOwner));
    } else {
      // Set default owner data
      const defaultOwner: Owner = {
        id: 'owner-1',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91 98765 43210',
        aadhaar: '****-****-1234',
        license: 'KA02-****-5678',
        location: 'Bangalore, Karnataka',
        joinDate: 'January 2024',
        verified: true
      };
      setOwner(defaultOwner);
      localStorage.setItem(STORAGE_KEYS.owner, JSON.stringify(defaultOwner));
    }
  }, []);

  // Get vehicles and bookings for current owner from global state
  const vehicles = owner ? getVehiclesByOwner(owner.id) : [];
  const bookings = owner ? getBookingsByOwner(owner.id) : [];

  const addVehicle = useCallback((vehicleData: Omit<Vehicle, 'id' | 'ownerId' | 'rating' | 'totalBookings' | 'totalEarnings' | 'lastBooked' | 'gpsStatus'>) => {
    if (!owner) return null;

    const newVehicle = addGlobalVehicle({
      ...vehicleData,
      ownerId: owner.id,
      ownerName: owner.name,
      rating: 5.0,
      totalBookings: 0,
      totalEarnings: 0,
      lastBooked: 'Never',
      gpsStatus: 'active',
      features: ['GPS Enabled', 'Verified Owner']
    });

    return newVehicle;
  }, [addGlobalVehicle, owner]);

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
    setOwner
  };
};
