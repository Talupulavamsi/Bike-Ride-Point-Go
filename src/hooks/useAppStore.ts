
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/contexts/FirebaseContext';
import { vehicleService, bookingService, FirebaseVehicle, FirebaseBooking } from '@/services/firebaseService';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, collection, onSnapshot, query, where, setDoc, serverTimestamp, deleteDoc, getDocs, runTransaction, getDoc } from 'firebase/firestore';

// Legacy interfaces for backward compatibility
export interface GlobalVehicle {
  id: string;
  name: string;
  type: 'bike' | 'scooter' | 'car';
  price: number;
  location: string;
  model?: string;
  cc?: string;
  color?: string;
  description?: string;
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
  slotId?: string; // single-day legacy
  slotIds?: string[]; // range support
}

// Helper functions to convert between Firebase and legacy formats
const convertFirebaseVehicle = (fbVehicle: FirebaseVehicle): GlobalVehicle => ({
  id: fbVehicle.id || '',
  name: fbVehicle.name,
  type: fbVehicle.type,
  price: fbVehicle.price,
  location: fbVehicle.location,
  model: (fbVehicle as any).model,
  cc: (fbVehicle as any).cc,
  color: (fbVehicle as any).color,
  description: (fbVehicle as any).description,
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
  startDate: fbBooking.startDate,
  endDate: fbBooking.endDate,
  pickupTime: fbBooking.pickupTime,
  duration: fbBooking.duration,
  totalAmount: fbBooking.totalAmount,
  status: fbBooking.status,
  location: fbBooking.location,
  bookingDate: ((fbBooking as any).createdAt?.toDate?.() || (fbBooking as any).createdAt || new Date()).toISOString(),
  amount: `₹${fbBooking.totalAmount}`,
  startTime: fbBooking.pickupTime,
  slotId: (fbBooking as any).slotId,
  slotIds: (fbBooking as any).slotIds
});

export const useAppStore = () => {
  const [vehicles, setVehicles] = useState<GlobalVehicle[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<GlobalVehicle[]>([]);
  const [browseVehicles, setBrowseVehicles] = useState<GlobalVehicle[]>([]);
  const [bookings, setBookings] = useState<GlobalBooking[]>([]);
  const [ownerBookings, setOwnerBookings] = useState<GlobalBooking[]>([]);
  const [renterBookings, setRenterBookings] = useState<GlobalBooking[]>([]);
  const [lockedVehicleIdsToday, setLockedVehicleIdsToday] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userProfile, user, updateProfile } = useFirebase();

  // Load data from Firebase when user changes with real-time listeners
  useEffect(() => {
    setLoading(true);
    let unsubscribeVehicles: (() => void) | undefined;
    let unsubscribeAvailable: (() => void) | undefined;
    let unsubscribeBrowse: (() => void) | undefined;
    let unsubscribeBookingsOwner: (() => void) | undefined;
    let unsubscribeBookingsRenter: (() => void) | undefined;
    let unsubscribeLocksToday: (() => void) | undefined;

    try {
      // Vehicles real-time via Firestore (owner list whenever authenticated)
      if (user) {
        const qOwner = query(
          collection(db, 'vehicles'),
          where('ownerId', '==', user.uid)
        );
        unsubscribeVehicles = onSnapshot(qOwner, (snap) => {
          const list: GlobalVehicle[] = snap.docs.map(d => convertFirebaseVehicle({ id: d.id, ...(d.data() as any) }));
          setVehicles(list);
        }, (err) => {
          console.warn('Firestore vehicles (owner) listener error, falling back to memory:', err);
          unsubscribeVehicles = vehicleService.onOwnerVehiclesChange(user.uid, (fbVehicles) => {
            setVehicles(fbVehicles.map(convertFirebaseVehicle));
          });
        });
      } else {
        // Not an owner or not logged in: clear owner vehicles list
        setVehicles([]);
      }

      // Always listen to globally available vehicles (kept for compatibility)
      const qAvail = query(
        collection(db, 'vehicles'),
        where('status', '==', 'available'),
        where('isAvailable', '==', true)
      );
      unsubscribeAvailable = onSnapshot(qAvail, (snap) => {
        const list: GlobalVehicle[] = snap.docs.map(d => convertFirebaseVehicle({ id: d.id, ...(d.data() as any) }));
        setAvailableVehicles(list);
      }, (err) => {
        console.warn('Firestore available vehicles listener error, falling back to memory:', err);
        unsubscribeAvailable = vehicleService.onAvailableVehiclesChange((all) => {
          setAvailableVehicles(all.map(convertFirebaseVehicle));
        });
      });

      // New: listen to all vehicles for renter browsing UI (so we can show Not Available too)
      try {
        unsubscribeBrowse = onSnapshot(collection(db, 'vehicles'), (snap) => {
          const list: GlobalVehicle[] = snap.docs.map(d => convertFirebaseVehicle({ id: d.id, ...(d.data() as any) }));
          setBrowseVehicles(list);
        }, (err) => {
          console.warn('Firestore browse vehicles listener error, falling back to available only:', err);
          // Fallback to available list if all-vehicles fails
          setBrowseVehicles(prev => {
            return availableVehicles;
          });
        });
      } catch (e) {
        console.warn('Error setting browse vehicles listener', e);
      }

      // Also listen to today's booking locks to exclude same-day booked vehicles from renter list
      try {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const isoDate = `${yyyy}-${mm}-${dd}`;
        const qLocks = query(collection(db, 'bookingLocks'), where('date', '==', isoDate));
        unsubscribeLocksToday = onSnapshot(qLocks, (snap) => {
          const ids = snap.docs
            .map(d => d.data() as any)
            .filter(data => !data.cancelledAt) // ignore cancelled locks
            .map(data => data.vehicleId as string)
            .filter(Boolean);
          setLockedVehicleIdsToday(ids);
        }, (err) => {
          console.warn('Failed to listen to bookingLocks (today):', err);
          setLockedVehicleIdsToday([]);
        });
      } catch (e) {
        console.warn('Error setting locks listener', e);
      }

      // Bookings listeners (both) when authenticated
      if (user) {
        try {
          const qOwnerBookings = query(collection(db, 'bookings'), where('ownerId', '==', user.uid));
          unsubscribeBookingsOwner = onSnapshot(qOwnerBookings, (snap) => {
            const list: GlobalBooking[] = snap.docs.map(d => {
              const data = d.data() as any;
              return convertFirebaseBooking({ id: d.id, ...(data as FirebaseBooking) });
            });
            setOwnerBookings(list);
            if (userProfile?.role === 'owner') setBookings(list);
          }, (err) => {
            console.warn('Firestore owner bookings listener error, falling back to memory:', err);
            unsubscribeBookingsOwner = bookingService.onOwnerBookingsChange(user.uid, (fbBookings) => {
              const list = fbBookings.map(convertFirebaseBooking);
              setOwnerBookings(list);
              if (userProfile?.role === 'owner') setBookings(list);
            });
          });

          const qRenterBookings = query(collection(db, 'bookings'), where('renterId', '==', user.uid));
          unsubscribeBookingsRenter = onSnapshot(qRenterBookings, (snap) => {
            const list: GlobalBooking[] = snap.docs.map(d => {
              const data = d.data() as any;
              return convertFirebaseBooking({ id: d.id, ...(data as FirebaseBooking) });
            });
            setRenterBookings(list);
            if (userProfile && userProfile.role !== 'owner') setBookings(list);
          }, (err) => {
            console.warn('Firestore renter bookings listener error, falling back to memory:', err);
            unsubscribeBookingsRenter = bookingService.onRenterBookingsChange(user.uid, (fbBookings) => {
              const list = fbBookings.map(convertFirebaseBooking);
              setRenterBookings(list);
              if (userProfile && userProfile.role !== 'owner') setBookings(list);
            });
          });
        } catch (err) {
          console.warn('Failed to attach Firestore bookings listeners', err);
        }
      } else {
        setBookings([]);
        setOwnerBookings([]);
        setRenterBookings([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error setting up real-time listeners:', error);
      setLoading(false);
    }

    return () => {
      unsubscribeVehicles?.();
      unsubscribeAvailable?.();
      unsubscribeBookingsOwner?.();
      unsubscribeBookingsRenter?.();
      unsubscribeLocksToday?.();
      unsubscribeBrowse?.();
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
        model: vehicleData.model,
        cc: vehicleData.cc,
        color: vehicleData.color,
        description: vehicleData.description,
        isAvailable: true,
        status: 'available',
        rating: vehicleData.rating ?? 0,
        totalBookings: vehicleData.totalBookings ?? 0,
        totalEarnings: vehicleData.totalEarnings ?? 0,
        lastBooked: vehicleData.lastBooked || '',
        image: vehicleData.image || '',
        gpsStatus: vehicleData.gpsStatus || 'active',
        ownerId: user.uid,
        ownerName: userProfile.name,
        features: vehicleData.features ?? []
      };

      const vehicleId = await vehicleService.addVehicle(fbVehicleData);

      // Persist vehicle in Firestore with the same ID for consistency
      try {
        const vehDocRef = doc(db, 'vehicles', vehicleId);
        await setDoc(vehDocRef, {
          ...fbVehicleData,
          createdAt: serverTimestamp(),
        });
        // Mirror under user's subcollection for easy per-owner access (best-effort)
        try {
          await setDoc(doc(db, 'users', user.uid, 'vehicles', vehicleId), {
            vehicleRef: vehDocRef,
            name: fbVehicleData.name,
            type: fbVehicleData.type,
            price: fbVehicleData.price,
            status: 'available',
            isAvailable: true,
            createdAt: serverTimestamp(),
          });
        } catch (subErr) {
          console.warn('Failed to mirror vehicle under user subcollection', subErr);
        }
      } catch (e) {
        console.warn('Failed to persist vehicle in Firestore', e);
        toast({
          title: 'Firestore write failed',
          description: 'Could not save vehicle to the database. Please check Firestore rules and config.',
          variant: 'destructive'
        });
        throw e;
      }

      // Ensure profile reflects ownership: create user doc if missing, set role to 'owner', and increment totalVehicles
      try {
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              name: userProfile?.name || '',
              email: userProfile?.email || '',
              phone: userProfile?.phone || '',
              role: 'owner',
              kycCompleted: userProfile?.kycCompleted ?? false,
              createdAt: new Date().toISOString(),
              totalVehicles: 0,
              totalEarnings: 0,
              averageRating: 5.0,
            }, { merge: true } as any);
          }
          await updateDoc(userRef, { totalVehicles: increment(1) });
        }
        if (userProfile.role !== 'owner') await updateProfile({ role: 'owner' });
      } catch (e) {
        console.warn('Profile stats update failed', e);
      }
      
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
      // Compute per-day slots for the whole date range and create booking locks
      const start = bookingData.startDate instanceof Date ? bookingData.startDate : new Date(bookingData.startDate);
      const end = bookingData.endDate instanceof Date ? bookingData.endDate : new Date(bookingData.endDate);
      const days: { slotId: string; isoDate: string }[] = [];
      {
        const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        while (cur <= last) {
          const yyyy = cur.getFullYear();
          const mm = String(cur.getMonth() + 1).padStart(2, '0');
          const dd = String(cur.getDate()).padStart(2, '0');
          const yyyymmdd = `${yyyy}${mm}${dd}`;
          days.push({ slotId: `${bookingData.vehicleId}_${yyyymmdd}`, isoDate: `${yyyy}-${mm}-${dd}` });
          cur.setDate(cur.getDate() + 1);
        }
      }

      const createdSlots: string[] = [];
      try {
        for (const day of days) {
          await setDoc(doc(db, 'bookingLocks', day.slotId), {
            slotId: day.slotId,
            vehicleId: bookingData.vehicleId,
            date: day.isoDate,
            renterId: user.uid,
            createdAt: serverTimestamp(),
          });
          createdSlots.push(day.slotId);
        }
      } catch (e: any) {
        // If permission denied, surface the real cause
        if (e?.code === 'permission-denied') {
          toast({
            title: 'Permission denied',
            description: 'Your account is not allowed to create booking locks. Please sign in and check Firestore rules.',
            variant: 'destructive'
          });
          throw e;
        }
        // Rollback created locks if any later lock fails (availability or other error)
        try {
          for (const sid of createdSlots) {
            await updateDoc(doc(db, 'bookingLocks', sid), { cancelledAt: serverTimestamp() });
          }
        } catch {}
        toast({
          title: 'Vehicle Not Available',
          description: 'The vehicle is already booked for part of the selected range. Choose different dates.',
          variant: 'destructive'
        });
        throw e;
      }

      const fbBookingData: Omit<FirebaseBooking, 'id' | 'createdAt'> = {
        ...bookingData,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        renterId: user.uid,
        renterName: userProfile.name,
        slotIds: createdSlots,
      };

      const bookingId = await bookingService.createBooking(fbBookingData);

      // Persist booking in Firestore
      try {
        const bookingRef = doc(db, 'bookings', bookingId);
        await setDoc(bookingRef, {
          ...fbBookingData,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Failed to persist booking in Firestore', e);
      }

      // Increment owner's total earnings using Firestore atomic increment
      try {
        await updateDoc(doc(db, 'users', bookingData.ownerId), {
          totalEarnings: increment(bookingData.totalAmount || 0),
        });
      } catch (e) {
        console.warn('Owner earnings update failed', e);
      }

      // Update vehicle status in Firestore to reflect booking
      try {
        await updateDoc(doc(db, 'vehicles', bookingData.vehicleId), {
          status: 'booked',
          isAvailable: false,
          lastBooked: 'Currently booked',
          totalBookings: increment(1),
          totalEarnings: increment(bookingData.totalAmount || 0),
        });
      } catch (e) {
        console.warn('Vehicle status update failed', e);
      }
      
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
      // Persist status change in Firestore and free the vehicle
      try {
        await updateDoc(doc(db, 'bookings', bookingId), { status: 'completed' });
      } catch {}
      
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

  const cancelBooking = useCallback(async (booking: Pick<GlobalBooking, 'id' | 'vehicleId' | 'slotId' | 'slotIds'>) => {
    try {
      // Update status in memory service
      await bookingService.updateBookingStatus(booking.id, 'cancelled');
      // Persist status to Firestore
      try {
        await updateDoc(doc(db, 'bookings', booking.id), { status: 'cancelled' });
      } catch {}
      // Free vehicle immediately
      try {
        await updateDoc(doc(db, 'vehicles', booking.vehicleId), {
          status: 'available',
          isAvailable: true,
          lastBooked: 'Cancelled recently',
        });
      } catch {}
      // Delete booking lock so others can see availability
      try {
        const ids = (booking as any).slotIds && (booking as any).slotIds.length ? (booking as any).slotIds : ((booking as any).slotId ? [(booking as any).slotId] : []);
        for (const sid of ids) {
          try {
            await deleteDoc(doc(db, 'bookingLocks', sid));
          } catch {
            await updateDoc(doc(db, 'bookingLocks', sid), { cancelledAt: serverTimestamp() }).catch(() => {});
          }
        }
      } catch {}

      // Keep booking document for history (status: cancelled)

      toast({
        title: 'Booking Cancelled',
        description: 'The vehicle is now available for others to book.',
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel booking. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const updateBookingStatus = useCallback(async (bookingId: string, status: GlobalBooking['status']) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      // Persist status change in Firestore
      try {
        await updateDoc(doc(db, 'bookings', bookingId), { status });
      } catch {}
      
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
  const getAvailableVehicles = () => availableVehicles.filter(v => !lockedVehicleIdsToday.includes(v.id));
  const getBrowseVehicles = () => browseVehicles;

  // Check overlap by querying bookings for a vehicle and verifying date ranges
  const isVehicleAvailable = useCallback(async (vehicleId: string, startDate: Date, endDate: Date): Promise<{ ok: boolean; conflict?: { startDate: Date; endDate: Date } }> => {
    try {
      const s = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const e = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const toISO = (d: Date) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      // Query bookingLocks for this vehicle (no date filters to avoid composite index requirement)
      const qLocks = query(
        collection(db, 'bookingLocks'),
        where('vehicleId', '==', vehicleId)
      );
      const snap = await getDocs(qLocks);

      const sISO = toISO(s);
      const eISO = toISO(e);
      const activeLocks = snap.docs
        .map((d: any) => d.data() as any)
        .filter((b: any) => !b.cancelledAt && b.date >= sISO && b.date <= eISO);

      if (activeLocks.length > 0) {
        const dates = activeLocks.map((b: any) => new Date(`${b.date}T00:00:00`));
        const min = new Date(Math.min(...dates.map((d: Date) => d.getTime())));
        const max = new Date(Math.max(...dates.map((d: Date) => d.getTime())));
        return { ok: false, conflict: { startDate: min, endDate: max } };
      }
      return { ok: true };
    } catch (err) {
      console.warn('Availability check failed, assuming not available', err);
      return { ok: false };
    }
  }, []);
  
  // Utility: return today's locked vehicle IDs (used by UI badges)
  const getLockedVehicleIdsToday = () => lockedVehicleIdsToday;

  // Utility: fetch booked dates (active locks) for a vehicle
  const getBookedDates = useCallback(async (vehicleId: string): Promise<string[]> => {
    try {
      const qLocks = query(
        collection(db, 'bookingLocks'),
        where('vehicleId', '==', vehicleId)
      );
      const snap = await getDocs(qLocks);
      const dates = snap.docs
        .map((d: any) => d.data() as any)
        .filter((b: any) => !b.cancelledAt)
        .map((b: any) => b.date as string);
      // unique and sorted
      const uniq = Array.from(new Set(dates)).sort();
      return uniq;
    } catch (e) {
      return [];
    }
  }, []);
  
  const getVehiclesByOwner = (ownerId: string) => vehicles.filter(v => v.ownerId === ownerId);
  
  const getBookingsByOwner = (ownerId: string) => ownerBookings.filter(b => b.ownerId === ownerId);
  
  const getBookingsByRenter = (renterId: string) => renterBookings.filter(b => b.renterId === renterId);

  // Rate a vehicle (1-5): stores per-user rating and updates vehicle average rating and ratingCount
  const rateVehicle = useCallback(async (vehicleId: string, rating: number) => {
    if (!user) throw new Error('Must be logged in to rate');
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');
    const vehRef = doc(db, 'vehicles', vehicleId);
    const userRatingRef = doc(db, 'vehicles', vehicleId, 'ratings', user.uid);
    await runTransaction(db as any, async (tx: any) => {
      const vehSnap = await tx.get(vehRef);
      const data = vehSnap.exists() ? vehSnap.data() as any : {};
      const currentAvg = Number(data.rating || 0);
      const currentCount = Number(data.ratingCount || 0);
      const newCount = currentCount + 1;
      const newAvg = Number(((currentAvg * currentCount + rating) / newCount).toFixed(2));
      tx.update(vehRef, { rating: newAvg, ratingCount: newCount });
      tx.set(userRatingRef, { rating, userId: user.uid, createdAt: serverTimestamp() }, { merge: true });
    });
    toast({ title: 'Thanks for rating!', description: 'Your feedback helps others choose better.' });
  }, [db, toast, user]);

  return {
    vehicles,
    availableVehicles,
    bookings,
    ownerBookings,
    renterBookings,
    loading,
    addVehicle,
    createBooking,
    completeRide,
    updateBookingStatus,
    cancelBooking,
    getAvailableVehicles,
    getBrowseVehicles,
    getLockedVehicleIdsToday,
    getVehiclesByOwner,
    getBookingsByOwner,
    getBookingsByRenter,
    isVehicleAvailable,
    getBookedDates,
    rateVehicle
  };
};
