
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/contexts/FirebaseContext';
import { vehicleService, bookingService, FirebaseVehicle, FirebaseBooking } from '@/services/firebaseService';
import { Timestamp } from 'firebase/firestore';

// Legacy interfaces for backward compatibility
export interface GlobalVehicle {
  id: string;
  name: string;
  type: 'bike' | 'scooter' | 'car';
  price: number;
  location: string;
  isAvailable: boolean;
  status: 'available' | 'booked' | 'maintenance';
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
  // Legacy properties for backward compatibility
  amount: string;
  startTime: string;
}

// Helper functions to convert between Firebase and legacy formats
const convertFirebaseVehicle = (fbVehicle: FirebaseVehicle): GlobalVehicle => ({
  id: fbVehicle.id || '',
  name: fbVehicle.name,
  type: fbVehicle.type,
  price: fbVehicle.price,
  location: fbVehicle.location,
  isAvailable: fbVehicle.isAvailable,
  status: fbVehicle.status,
  rating: fbVehicle.rating,
  totalBookings: fbVehicle.totalBookings,
  totalEarnings: fbVehicle.totalEarnings,
  lastBooked: fbVehicle.lastBooked,
  image: fbVehicle.image,
  gpsStatus: fbVehicle.gpsStatus,
  ownerId: fbVehicle.ownerId,
  ownerName: fbVehicle.ownerName,
  features: fbVehicle.features
});

const convertFirebaseBooking = (fbBooking: FirebaseBooking): GlobalBooking => ({
  id: fbBooking.id || '',
  vehicleId: fbBooking.vehicleId,
  vehicleName: fbBooking.vehicleName,
  vehicleType: fbBooking.vehicleType,
  renterId: fbBooking.renterId,
  renterName: fbBooking.renterName,
  ownerId: fbBooking.ownerId,
  ownerName: fbBooking.ownerName,
  startDate: fbBooking.startDate.toDate(),
  endDate: fbBooking.endDate.toDate(),
  pickupTime: fbBooking.pickupTime,
  duration: fbBooking.duration,
  totalAmount: fbBooking.totalAmount,
  status: fbBooking.status,
  location: fbBooking.location,
  bookingDate: fbBooking.createdAt.toDate().toISOString(),
  amount: `₹${fbBooking.totalAmount}`,
  startTime: fbBooking.pickupTime
});

export const useAppStore = () => {
  const [vehicles, setVehicles] = useState<GlobalVehicle[]>([]);
  const [bookings, setBookings] = useState<GlobalBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userProfile, user } = useFirebase();

  // Load data from Firebase when user changes with real-time listeners
  useEffect(() => {
    if (!user || !userProfile) {
      setVehicles([]);
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribeVehicles: (() => void) | undefined;
    let unsubscribeBookings: (() => void) | undefined;

    try {
      // Check if user is an owner by looking for vehicles they own
      // This allows users who submit vehicles to see them in owner dashboard
      unsubscribeVehicles = vehicleService.onOwnerVehiclesChange(user.uid, (fbVehicles) => {
        const ownerVehicles = fbVehicles.map(convertFirebaseVehicle);
        
        // If user has vehicles, also fetch all available vehicles for booking
        if (userProfile.role === 'user' && ownerVehicles.length === 0) {
          // User mode: show all available vehicles
          vehicleService.onAvailableVehiclesChange((allVehicles) => {
            setVehicles(allVehicles.map(convertFirebaseVehicle));
          });
        } else {
          // Owner mode: show own vehicles
          setVehicles(ownerVehicles);
        }
      });

      // Set up bookings listener based on role
      if (userProfile.role === 'owner') {
        // Owner sees bookings for their vehicles
        unsubscribeBookings = bookingService.onOwnerBookingsChange(user.uid, (fbBookings) => {
          setBookings(fbBookings.map(convertFirebaseBooking));
        });
      } else {
        // Users see their own bookings
        unsubscribeBookings = bookingService.onRenterBookingsChange(user.uid, (fbBookings) => {
          setBookings(fbBookings.map(convertFirebaseBooking));
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error setting up real-time listeners:', error);
      setLoading(false);
    }

    return () => {
      unsubscribeVehicles?.();
      unsubscribeBookings?.();
    };
  }, [user, userProfile]);

  const addVehicle = useCallback(async (vehicleData: Omit<GlobalVehicle, 'id' | 'status'>) => {
    if (!user || !userProfile) {
      throw new Error('User must be logged in to add vehicles');
    }

    try {
      const fbVehicleData: Omit<FirebaseVehicle, 'id' | 'createdAt' | 'source'> = {
        name: vehicleData.name,
        type: vehicleData.type,
        price: vehicleData.price,
        location: vehicleData.location,
        isAvailable: true,
        status: 'available',
        rating: vehicleData.rating,
        totalBookings: vehicleData.totalBookings,
        totalEarnings: vehicleData.totalEarnings,
        lastBooked: vehicleData.lastBooked,
        image: vehicleData.image,
        gpsStatus: vehicleData.gpsStatus,
        ownerId: user.uid,
        ownerName: userProfile.name,
        features: vehicleData.features
      };

      const vehicleId = await vehicleService.addVehicle(fbVehicleData);
      
      toast({
        title: "🚗 Vehicle Listed Successfully!",
        description: `${vehicleData.name} is now available for booking. You're automatically registered as an owner!`,
      });

      return { ...vehicleData, id: vehicleId, status: 'available' as const };
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to list vehicle. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }, [user, userProfile, toast]);

  const createBooking = useCallback(async (bookingData: Omit<GlobalBooking, 'id' | 'bookingDate' | 'amount' | 'startTime'>) => {
    if (!user || !userProfile) {
      throw new Error('User must be logged in to create booking');
    }

    try {
      const fbBookingData: Omit<FirebaseBooking, 'id' | 'createdAt'> = {
        ...bookingData,
        startDate: Timestamp.fromDate(bookingData.startDate),
        endDate: Timestamp.fromDate(bookingData.endDate),
        renterId: user.uid,
        renterName: userProfile.name
      };

      const bookingId = await bookingService.createBooking(fbBookingData);
      
      toast({
        title: "🎉 Booking Confirmed!",
        description: `Your booking for ${bookingData.vehicleName} is confirmed. Vehicle is now locked for you.`,
      });

      return {
        ...bookingData,
        id: bookingId,
        bookingDate: new Date().toISOString(),
        amount: `₹${bookingData.totalAmount}`,
        startTime: bookingData.pickupTime
      };
    } catch (error: any) {
      console.error('Error creating booking:', error);
      const errorMessage = error.message || 'Failed to create booking. Please try again.';
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  }, [user, userProfile, toast]);

  const completeRide = useCallback(async (bookingId: string) => {
    try {
      await bookingService.completeBooking(bookingId);
      
      toast({
        title: "✅ Ride Completed!",
        description: "The vehicle is now available for new bookings",
      });
    } catch (error) {
      console.error('Error completing ride:', error);
      toast({
        title: "Error",
        description: "Failed to complete ride. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const updateBookingStatus = useCallback(async (bookingId: string, status: GlobalBooking['status']) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      
      toast({
        title: "Booking Updated",
        description: `Booking status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error", 
        description: "Failed to update booking status. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  // Filtered getters
  const getAvailableVehicles = () => vehicles.filter(v => v.isAvailable && v.status === 'available');
  
  const getVehiclesByOwner = (ownerId: string) => vehicles.filter(v => v.ownerId === ownerId);
  
  const getBookingsByOwner = (ownerId: string) => bookings.filter(b => b.ownerId === ownerId);
  
  const getBookingsByRenter = (renterId: string) => bookings.filter(b => b.renterId === renterId);

  return {
    vehicles,
    bookings,
    loading,
    addVehicle,
    createBooking,
    completeRide,
    updateBookingStatus,
    getAvailableVehicles,
    getVehiclesByOwner,
    getBookingsByOwner,
    getBookingsByRenter
  };
};
