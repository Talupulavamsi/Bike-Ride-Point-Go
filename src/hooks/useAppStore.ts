
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface GlobalVehicle {
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
  ownerName: string;
  features: string[];
}

export interface GlobalBooking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: 'bike' | 'scooter' | 'car';
  renterId: string;
  renterName: string;
  ownerId: string;
  ownerName: string;
  startDate: Date;
  endDate: Date;
  pickupTime: string;
  duration: string;
  totalAmount: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  location: string;
  bookingDate: string;
}

const STORAGE_KEYS = {
  vehicles: 'global_vehicles',
  bookings: 'global_bookings'
};

// Simulated real-time event emitter
class EventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

const eventEmitter = new EventEmitter();

export const useAppStore = () => {
  const [vehicles, setVehicles] = useState<GlobalVehicle[]>([]);
  const [bookings, setBookings] = useState<GlobalBooking[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedVehicles = localStorage.getItem(STORAGE_KEYS.vehicles);
    const savedBookings = localStorage.getItem(STORAGE_KEYS.bookings);

    if (savedVehicles) {
      const parsedVehicles = JSON.parse(savedVehicles);
      setVehicles(parsedVehicles);
    }

    if (savedBookings) {
      const parsedBookings = JSON.parse(savedBookings);
      const bookingsWithDates = parsedBookings.map((booking: any) => ({
        ...booking,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate)
      }));
      setBookings(bookingsWithDates);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.vehicles, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
  }, [bookings]);

  // Real-time event listeners
  useEffect(() => {
    const handleVehicleAdded = (vehicle: GlobalVehicle) => {
      setVehicles(prev => [...prev, vehicle]);
      toast({
        title: "🚗 New Vehicle Available!",
        description: `${vehicle.name} is now available for booking in ${vehicle.location}`,
      });
    };

    const handleVehicleBooked = (booking: GlobalBooking) => {
      setBookings(prev => [booking, ...prev]);
      setVehicles(prev => prev.map(v => 
        v.id === booking.vehicleId 
          ? { ...v, isAvailable: false, lastBooked: 'Currently booked' }
          : v
      ));
      
      // Notify owner
      toast({
        title: "📋 New Booking Received!",
        description: `${booking.renterName} booked ${booking.vehicleName} for ${booking.duration}`,
      });
    };

    const handleRideCompleted = (bookingId: string) => {
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'completed' } : b
      ));
      
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        setVehicles(prev => prev.map(v => 
          v.id === booking.vehicleId 
            ? { ...v, isAvailable: true, lastBooked: 'Recently completed' }
            : v
        ));
        
        toast({
          title: "✅ Ride Completed!",
          description: `${booking.vehicleName} is now available again`,
        });
      }
    };

    eventEmitter.on('vehicleAdded', handleVehicleAdded);
    eventEmitter.on('vehicleBooked', handleVehicleBooked);
    eventEmitter.on('rideCompleted', handleRideCompleted);

    return () => {
      eventEmitter.off('vehicleAdded', handleVehicleAdded);
      eventEmitter.off('vehicleBooked', handleVehicleBooked);
      eventEmitter.off('rideCompleted', handleRideCompleted);
    };
  }, [toast, bookings]);

  const addVehicle = useCallback((vehicleData: Omit<GlobalVehicle, 'id'>) => {
    const newVehicle: GlobalVehicle = {
      ...vehicleData,
      id: Date.now().toString()
    };

    // Emit real-time event
    eventEmitter.emit('vehicleAdded', newVehicle);
    return newVehicle;
  }, []);

  const createBooking = useCallback((bookingData: Omit<GlobalBooking, 'id' | 'bookingDate'>) => {
    const newBooking: GlobalBooking = {
      ...bookingData,
      id: Date.now().toString(),
      bookingDate: new Date().toISOString()
    };

    // Emit real-time event
    eventEmitter.emit('vehicleBooked', newBooking);
    
    // Show user confirmation
    toast({
      title: "🎉 Booking Confirmed!",
      description: `Your booking for ${newBooking.vehicleName} is confirmed. Check My Bookings for details.`,
    });

    return newBooking;
  }, [toast]);

  const completeRide = useCallback((bookingId: string) => {
    eventEmitter.emit('rideCompleted', bookingId);
  }, []);

  const getAvailableVehicles = () => vehicles.filter(v => v.isAvailable);
  
  const getVehiclesByOwner = (ownerId: string) => vehicles.filter(v => v.ownerId === ownerId);
  
  const getBookingsByOwner = (ownerId: string) => bookings.filter(b => b.ownerId === ownerId);
  
  const getBookingsByRenter = (renterId: string) => bookings.filter(b => b.renterId === renterId);

  return {
    vehicles,
    bookings,
    addVehicle,
    createBooking,
    completeRide,
    getAvailableVehicles,
    getVehiclesByOwner,
    getBookingsByOwner,
    getBookingsByRenter,
    eventEmitter
  };
};
