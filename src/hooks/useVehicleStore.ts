
import { useState, useCallback, useEffect } from 'react';

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
  vehicles: 'owner_vehicles',
  bookings: 'owner_bookings',
  owner: 'owner_profile'
};

export const useVehicleStore = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [owner, setOwner] = useState<Owner | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedVehicles = localStorage.getItem(STORAGE_KEYS.vehicles);
    const savedBookings = localStorage.getItem(STORAGE_KEYS.bookings);
    const savedOwner = localStorage.getItem(STORAGE_KEYS.owner);

    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
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

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.vehicles, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
  }, [bookings]);

  const addVehicle = useCallback((vehicleData: Omit<Vehicle, 'id' | 'ownerId' | 'rating' | 'totalBookings' | 'totalEarnings' | 'lastBooked' | 'gpsStatus'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now().toString(),
      ownerId: owner?.id || 'owner-1',
      rating: 5.0,
      totalBookings: 0,
      totalEarnings: 0,
      lastBooked: 'Never',
      gpsStatus: 'active'
    };

    setVehicles(prev => [...prev, newVehicle]);
    return newVehicle;
  }, [owner?.id]);

  const removeVehicle = useCallback((vehicleId: string) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    // Also remove related bookings
    setBookings(prev => prev.filter(b => b.vehicleId !== vehicleId));
  }, []);

  const updateVehicle = useCallback((vehicleId: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => 
      v.id === vehicleId ? { ...v, ...updates } : v
    ));
  }, []);

  const addBooking = useCallback((bookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString()
    };

    setBookings(prev => [...prev, newBooking]);
    
    // Update vehicle booking stats
    setVehicles(prev => prev.map(v => 
      v.id === bookingData.vehicleId 
        ? { 
            ...v, 
            totalBookings: v.totalBookings + 1,
            totalEarnings: v.totalEarnings + parseInt(bookingData.amount.replace('₹', '').replace(',', '')),
            lastBooked: bookingData.status === 'active' ? 'Currently booked' : 'Recently booked',
            isAvailable: bookingData.status === 'active' ? false : v.isAvailable
          }
        : v
    ));

    return newBooking;
  }, []);

  const updateBookingStatus = useCallback((bookingId: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status } : b
    ));

    // Update vehicle availability based on booking status
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setVehicles(prev => prev.map(v => 
        v.id === booking.vehicleId 
          ? { 
              ...v, 
              isAvailable: status === 'completed',
              lastBooked: status === 'completed' ? 'Recently completed' : v.lastBooked
            }
          : v
      ));
    }
  }, [bookings]);

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
