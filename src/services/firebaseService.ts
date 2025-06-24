
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
  Timestamp 
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
  rating: number;
  totalBookings: number;
  totalEarnings: number;
  lastBooked: string;
  image?: string;
  gpsStatus: 'active' | 'inactive';
  ownerId: string;
  ownerName: string;
  features: string[];
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
  // Add a new vehicle (owners only)
  async addVehicle(vehicleData: Omit<FirebaseVehicle, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'vehicles'), {
      ...vehicleData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Get all available vehicles
  async getAvailableVehicles(): Promise<FirebaseVehicle[]> {
    const q = query(
      collection(db, 'vehicles'), 
      where('isAvailable', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseVehicle));
  },

  // Get vehicles by owner
  async getVehiclesByOwner(ownerId: string): Promise<FirebaseVehicle[]> {
    const q = query(
      collection(db, 'vehicles'), 
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseVehicle));
  },

  // Update vehicle
  async updateVehicle(vehicleId: string, updates: Partial<FirebaseVehicle>): Promise<void> {
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    await updateDoc(vehicleRef, updates);
  },

  // Delete vehicle
  async deleteVehicle(vehicleId: string): Promise<void> {
    await deleteDoc(doc(db, 'vehicles', vehicleId));
  },

  // Real-time listener for available vehicles
  onAvailableVehiclesChange(callback: (vehicles: FirebaseVehicle[]) => void) {
    const q = query(
      collection(db, 'vehicles'), 
      where('isAvailable', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const vehicles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseVehicle));
      callback(vehicles);
    });
  }
};

// Booking operations
export const bookingService = {
  // Create a new booking
  async createBooking(bookingData: Omit<FirebaseBooking, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: Timestamp.now()
    });
    
    // Update vehicle availability
    await vehicleService.updateVehicle(bookingData.vehicleId, {
      isAvailable: false,
      lastBooked: 'Currently booked'
    });
    
    return docRef.id;
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

  // Update booking status
  async updateBookingStatus(bookingId: string, status: FirebaseBooking['status']): Promise<void> {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status });
    
    // If booking is completed, make vehicle available again
    if (status === 'completed') {
      const bookingDoc = await getDoc(bookingRef);
      if (bookingDoc.exists()) {
        const booking = bookingDoc.data() as FirebaseBooking;
        await vehicleService.updateVehicle(booking.vehicleId, {
          isAvailable: true,
          lastBooked: 'Recently completed'
        });
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

// Profile operations
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
  }
};
