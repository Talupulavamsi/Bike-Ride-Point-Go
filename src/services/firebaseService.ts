
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Vehicle interface for Firestore
export interface FirebaseVehicle {
  id?: string;
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
  source: 'user-submitted' | 'admin-added';
  createdAt: Timestamp;
}

// Booking interface for Firestore
export interface FirebaseBooking {
  id?: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: 'bike' | 'scooter' | 'car';
  renterId: string;
  renterName: string;
  ownerId: string;
  ownerName: string;
  startDate: Timestamp;
  endDate: Timestamp;
  pickupTime: string;
  duration: string;
  totalAmount: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  location: string;
  createdAt: Timestamp;
}

// Vehicle operations
export const vehicleService = {
  // Add a new vehicle with automatic owner registration
  async addVehicle(vehicleData: Omit<FirebaseVehicle, 'id' | 'createdAt' | 'source'>): Promise<string> {
    return await runTransaction(db, async (transaction) => {
      // Check if user exists as an owner, if not create owner profile
      const ownerRef = doc(db, 'owners', vehicleData.ownerId);
      const ownerDoc = await transaction.get(ownerRef);
      
      if (!ownerDoc.exists()) {
        // Auto-register user as owner by copying from users collection
        const userRef = doc(db, 'users', vehicleData.ownerId);
        const userDoc = await transaction.get(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Create owner profile from user data
          transaction.set(ownerRef, {
            ...userData,
            role: 'owner',
            totalVehicles: 1,
            totalEarnings: 0,
            averageRating: 5.0,
            joinedAsOwner: serverTimestamp(),
            source: 'user-submitted'
          });
        }
      } else {
        // Update vehicle count for existing owner
        const ownerData = ownerDoc.data();
        transaction.update(ownerRef, {
          totalVehicles: (ownerData.totalVehicles || 0) + 1
        });
      }
      
      // Add the vehicle with correct schema
      const vehicleRef = doc(collection(db, 'vehicles'));
      transaction.set(vehicleRef, {
        vehicleName: vehicleData.name,
        vehicleType: vehicleData.type,
        price: vehicleData.price,
        location: vehicleData.location,
        status: 'available',
        isAvailable: true,
        rating: vehicleData.rating,
        totalBookings: vehicleData.totalBookings,
        totalEarnings: vehicleData.totalEarnings,
        lastBooked: vehicleData.lastBooked,
        image: vehicleData.image,
        gpsStatus: vehicleData.gpsStatus,
        ownerId: vehicleData.ownerId,
        ownerName: vehicleData.ownerName,
        features: vehicleData.features,
        source: 'user-submitted',
        createdAt: serverTimestamp()
      });
      
      return vehicleRef.id;
    });
  },

  // Get all available vehicles for users
  async getAvailableVehicles(): Promise<FirebaseVehicle[]> {
    const q = query(
      collection(db, 'vehicles'), 
      where('status', '==', 'available'),
      where('isAvailable', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().vehicleName || doc.data().name,
      type: doc.data().vehicleType || doc.data().type,
      ...doc.data()
    } as FirebaseVehicle));
  },

  // Get vehicles by owner - fetch all vehicles where ownerId matches current user
  async getVehiclesByOwner(ownerId: string): Promise<FirebaseVehicle[]> {
    const q = query(
      collection(db, 'vehicles'), 
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().vehicleName || doc.data().name,
      type: doc.data().vehicleType || doc.data().type,
      ...doc.data()
    } as FirebaseVehicle));
  },

  // Update vehicle status (for booking/availability)
  async updateVehicleStatus(vehicleId: string, status: 'available' | 'booked' | 'maintenance'): Promise<void> {
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    await updateDoc(vehicleRef, { 
      status,
      isAvailable: status === 'available',
      lastBooked: status === 'booked' ? 'Currently booked' : 'Recently completed'
    });
  },

  // Update vehicle details
  async updateVehicle(vehicleId: string, updates: Partial<FirebaseVehicle>): Promise<void> {
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    await updateDoc(vehicleRef, updates);
  },

  // Delete vehicle
  async deleteVehicle(vehicleId: string): Promise<void> {
    await deleteDoc(doc(db, 'vehicles', vehicleId));
  },

  // Real-time listener for available vehicles (for users)
  onAvailableVehiclesChange(callback: (vehicles: FirebaseVehicle[]) => void) {
    const q = query(
      collection(db, 'vehicles'), 
      where('status', '==', 'available'),
      where('isAvailable', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const vehicles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().vehicleName || doc.data().name,
        type: doc.data().vehicleType || doc.data().type,
        ...doc.data()
      } as FirebaseVehicle));
      callback(vehicles);
    });
  },

  // Real-time listener for owner's vehicles - no role filtering, just ownerId
  onOwnerVehiclesChange(ownerId: string, callback: (vehicles: FirebaseVehicle[]) => void) {
    const q = query(
      collection(db, 'vehicles'), 
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const vehicles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().vehicleName || doc.data().name,
        type: doc.data().vehicleType || doc.data().type,
        ...doc.data()
      } as FirebaseVehicle));
      callback(vehicles);
    });
  }
};

// Booking operations with vehicle locking
export const bookingService = {
  // Create a new booking with transaction to prevent double booking
  async createBooking(bookingData: Omit<FirebaseBooking, 'id' | 'createdAt'>): Promise<string> {
    return await runTransaction(db, async (transaction) => {
      // First check if vehicle is still available
      const vehicleRef = doc(db, 'vehicles', bookingData.vehicleId);
      const vehicleDoc = await transaction.get(vehicleRef);
      
      if (!vehicleDoc.exists()) {
        throw new Error('Vehicle not found');
      }
      
      const vehicleData = vehicleDoc.data() as FirebaseVehicle;
      if (vehicleData.status !== 'available' || !vehicleData.isAvailable) {
        throw new Error('Vehicle is no longer available');
      }
      
      // Create the booking
      const bookingRef = doc(collection(db, 'bookings'));
      transaction.set(bookingRef, {
        ...bookingData,
        createdAt: serverTimestamp()
      });
      
      // Update vehicle status to booked
      transaction.update(vehicleRef, {
        status: 'booked',
        isAvailable: false,
        lastBooked: 'Currently booked'
      });
      
      return bookingRef.id;
    });
  },

  // Get bookings by renter (users)
  async getBookingsByRenter(renterId: string): Promise<FirebaseBooking[]> {
    const q = query(
      collection(db, 'bookings'), 
      where('renterId', '==', renterId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseBooking));
  },

  // Get bookings by owner
  async getBookingsByOwner(ownerId: string): Promise<FirebaseBooking[]> {
    const q = query(
      collection(db, 'bookings'), 
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseBooking));
  },

  // Complete a booking and make vehicle available again
  async completeBooking(bookingId: string): Promise<void> {
    return await runTransaction(db, async (transaction) => {
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingDoc = await transaction.get(bookingRef);
      
      if (!bookingDoc.exists()) {
        throw new Error('Booking not found');
      }
      
      const booking = bookingDoc.data() as FirebaseBooking;
      
      // Update booking status
      transaction.update(bookingRef, { status: 'completed' });
      
      // Make vehicle available again
      const vehicleRef = doc(db, 'vehicles', booking.vehicleId);
      transaction.update(vehicleRef, {
        status: 'available',
        isAvailable: true,
        lastBooked: 'Recently completed'
      });
    });
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: FirebaseBooking['status']): Promise<void> {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status });
    
    // If booking is completed, make vehicle available again
    if (status === 'completed') {
      const bookingDoc = await getDoc(bookingRef);
      if (bookingDoc.exists()) {
        const booking = bookingDoc.data() as FirebaseBooking;
        await vehicleService.updateVehicleStatus(booking.vehicleId, 'available');
      }
    }
  },

  // Real-time listener for owner bookings
  onOwnerBookingsChange(ownerId: string, callback: (bookings: FirebaseBooking[]) => void) {
    const q = query(
      collection(db, 'bookings'), 
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const bookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseBooking));
      callback(bookings);
    });
  },

  // Real-time listener for renter bookings
  onRenterBookingsChange(renterId: string, callback: (bookings: FirebaseBooking[]) => void) {
    const q = query(
      collection(db, 'bookings'), 
      where('renterId', '==', renterId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const bookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseBooking));
      callback(bookings);
    });
  }
};

// Profile operations for role-based collections
export const profileService = {
  // Update owner statistics
  async updateOwnerStats(ownerId: string, updates: {
    totalVehicles?: number;
    totalEarnings?: number;
    averageRating?: number;
  }): Promise<void> {
    const ownerRef = doc(db, 'owners', ownerId);
    await updateDoc(ownerRef, updates);
  },

  // Update user statistics  
  async updateUserStats(userId: string, updates: {
    totalRides?: number;
    totalSpent?: number;
    averageRating?: number;
  }): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
  },

  // Get owner profile
  async getOwnerProfile(ownerId: string) {
    const ownerDoc = await getDoc(doc(db, 'owners', ownerId));
    return ownerDoc.exists() ? ownerDoc.data() : null;
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  }
};
