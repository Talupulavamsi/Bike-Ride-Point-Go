
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GlobalVehicle, GlobalBooking } from '@/hooks/useAppStore';

// Vehicle operations
export const addVehicleToFirestore = async (vehicle: Omit<GlobalVehicle, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'vehicles'), vehicle);
    return { id: docRef.id, ...vehicle };
  } catch (error) {
    console.error('Error adding vehicle: ', error);
    throw error;
  }
};

export const getVehiclesFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'vehicles'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GlobalVehicle[];
  } catch (error) {
    console.error('Error getting vehicles: ', error);
    throw error;
  }
};

export const updateVehicleInFirestore = async (vehicleId: string, updates: Partial<GlobalVehicle>) => {
  try {
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    await updateDoc(vehicleRef, updates);
  } catch (error) {
    console.error('Error updating vehicle: ', error);
    throw error;
  }
};

export const deleteVehicleFromFirestore = async (vehicleId: string) => {
  try {
    await deleteDoc(doc(db, 'vehicles', vehicleId));
  } catch (error) {
    console.error('Error deleting vehicle: ', error);
    throw error;
  }
};

// Booking operations
export const addBookingToFirestore = async (booking: Omit<GlobalBooking, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...booking,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
    });
    return { id: docRef.id, ...booking };
  } catch (error) {
    console.error('Error adding booking: ', error);
    throw error;
  }
};

export const getBookingsFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      };
    }) as GlobalBooking[];
  } catch (error) {
    console.error('Error getting bookings: ', error);
    throw error;
  }
};

export const updateBookingInFirestore = async (bookingId: string, updates: Partial<GlobalBooking>) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const updateData = { ...updates };
    
    // Convert dates to ISO strings for Firestore
    if (updateData.startDate) {
      updateData.startDate = updateData.startDate.toISOString() as any;
    }
    if (updateData.endDate) {
      updateData.endDate = updateData.endDate.toISOString() as any;
    }
    
    await updateDoc(bookingRef, updateData);
  } catch (error) {
    console.error('Error updating booking: ', error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToVehicles = (callback: (vehicles: GlobalVehicle[]) => void) => {
  return onSnapshot(collection(db, 'vehicles'), (snapshot) => {
    const vehicles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GlobalVehicle[];
    callback(vehicles);
  });
};

export const subscribeToBookings = (callback: (bookings: GlobalBooking[]) => void) => {
  return onSnapshot(collection(db, 'bookings'), (snapshot) => {
    const bookings = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      };
    }) as GlobalBooking[];
    callback(bookings);
  });
};
