
// In-memory mock database and pub/sub utilities
type Unsubscribe = () => void;

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
  // Extended descriptive fields
  model?: string;
  cc?: string;
  color?: string;
  description?: string;
  gpsStatus: 'active' | 'inactive';
  ownerId: string;
  ownerName: string;
  features: string[];
  source?: 'user-submitted' | 'admin-added';
  createdAt: Date;
}

export interface FirebaseBooking {
  id?: string;
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
  slotId?: string;
  slotIds?: string[];
  createdAt: Date;
}

const mem = {
  vehicles: new Map<string, FirebaseVehicle>(),
  bookings: new Map<string, FirebaseBooking>(),
};

const listeners = {
  vehicles: new Set<(all: FirebaseVehicle[]) => void>(),
  ownerVehicles: new Map<string, Set<(list: FirebaseVehicle[]) => void>>(),
  ownerBookings: new Map<string, Set<(list: FirebaseBooking[]) => void>>(),
  renterBookings: new Map<string, Set<(list: FirebaseBooking[]) => void>>(),
};

function emitVehicles() {
  const all = Array.from(mem.vehicles.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  listeners.vehicles.forEach(cb => cb(all.filter(v => v.status === 'available' && v.isAvailable)));
  // per-owner
  listeners.ownerVehicles.forEach((set, ownerId) => {
    const list = all.filter(v => v.ownerId === ownerId);
    set.forEach(cb => cb(list));
  });
}

function emitBookings() {
  const all = Array.from(mem.bookings.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  listeners.ownerBookings.forEach((set, ownerId) => {
    const list = all.filter(b => b.ownerId === ownerId);
    set.forEach(cb => cb(list));
  });
  listeners.renterBookings.forEach((set, renterId) => {
    const list = all.filter(b => b.renterId === renterId);
    set.forEach(cb => cb(list));
  });
}

function genId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export const vehicleService = {
  async addVehicle(vehicleData: Omit<FirebaseVehicle, 'id' | 'createdAt' | 'source' | 'status' | 'isAvailable'>): Promise<string> {
    const id = genId('veh');
    const v: FirebaseVehicle = {
      id,
      ...vehicleData,
      status: 'available',
      isAvailable: true,
      source: 'user-submitted',
      createdAt: new Date(),
    };
    mem.vehicles.set(id, v);
    emitVehicles();
    return id;
  },

  async getAvailableVehicles(): Promise<FirebaseVehicle[]> {
    return Array.from(mem.vehicles.values()).filter(v => v.status === 'available' && v.isAvailable)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async getVehiclesByOwner(ownerId: string): Promise<FirebaseVehicle[]> {
    return Array.from(mem.vehicles.values()).filter(v => v.ownerId === ownerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async updateVehicleStatus(vehicleId: string, status: 'available' | 'booked' | 'maintenance'): Promise<void> {
    const v = mem.vehicles.get(vehicleId);
    if (!v) return;
    v.status = status;
    v.isAvailable = status === 'available';
    v.lastBooked = status === 'booked' ? 'Currently booked' : 'Recently completed';
    mem.vehicles.set(vehicleId, { ...v });
    emitVehicles();
  },

  async updateVehicle(vehicleId: string, updates: Partial<FirebaseVehicle>): Promise<void> {
    const v = mem.vehicles.get(vehicleId);
    if (!v) return;
    mem.vehicles.set(vehicleId, { ...v, ...updates });
    emitVehicles();
  },

  async deleteVehicle(vehicleId: string): Promise<void> {
    mem.vehicles.delete(vehicleId);
    emitVehicles();
  },

  onAvailableVehiclesChange(callback: (vehicles: FirebaseVehicle[]) => void): Unsubscribe {
    listeners.vehicles.add(callback);
    // emit current
    callback(Array.from(mem.vehicles.values()).filter(v => v.status === 'available' && v.isAvailable)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    return () => listeners.vehicles.delete(callback);
  },

  onOwnerVehiclesChange(ownerId: string, callback: (vehicles: FirebaseVehicle[]) => void): Unsubscribe {
    if (!listeners.ownerVehicles.has(ownerId)) listeners.ownerVehicles.set(ownerId, new Set());
    const set = listeners.ownerVehicles.get(ownerId)!;
    set.add(callback);
    callback(Array.from(mem.vehicles.values()).filter(v => v.ownerId === ownerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    return () => set.delete(callback);
  }
};

export const bookingService = {
  async createBooking(bookingData: Omit<FirebaseBooking, 'id' | 'createdAt'>): Promise<string> {
    const vehicle = mem.vehicles.get(bookingData.vehicleId);
    // If vehicle exists in memory, enforce availability; otherwise proceed (Firestore is authoritative)
    if (vehicle) {
      if (vehicle.status !== 'available' || !vehicle.isAvailable) throw new Error('Vehicle is no longer available');
    }

    const id = genId('book');
    const b: FirebaseBooking = { id, ...bookingData, createdAt: new Date() };
    mem.bookings.set(id, b);
    if (vehicle) {
      vehicle.status = 'booked';
      vehicle.isAvailable = false;
      vehicle.lastBooked = 'Currently booked';
      // Update vehicle aggregates based on booking
      vehicle.totalBookings = (vehicle.totalBookings || 0) + 1;
      vehicle.totalEarnings = (vehicle.totalEarnings || 0) + (bookingData.totalAmount || 0);
      mem.vehicles.set(vehicle.id!, { ...vehicle });
    }
    emitBookings();
    emitVehicles();
    return id;
  },

  async getBookingsByRenter(renterId: string): Promise<FirebaseBooking[]> {
    return Array.from(mem.bookings.values()).filter(b => b.renterId === renterId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async getBookingsByOwner(ownerId: string): Promise<FirebaseBooking[]> {
    return Array.from(mem.bookings.values()).filter(b => b.ownerId === ownerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async completeBooking(bookingId: string): Promise<void> {
    const b = mem.bookings.get(bookingId);
    if (!b) return;
    b.status = 'completed';
    mem.bookings.set(bookingId, { ...b });
    const v = mem.vehicles.get(b.vehicleId);
    if (v) {
      v.status = 'available';
      v.isAvailable = true;
      v.lastBooked = 'Recently completed';
      mem.vehicles.set(v.id!, { ...v });
    }
    emitBookings();
    emitVehicles();
  },

  async updateBookingStatus(bookingId: string, status: FirebaseBooking['status']): Promise<void> {
    const b = mem.bookings.get(bookingId);
    if (!b) return;
    b.status = status;
    mem.bookings.set(bookingId, { ...b });
    if (status === 'completed') {
      const v = mem.vehicles.get(b.vehicleId);
      if (v) {
        v.status = 'available';
        v.isAvailable = true;
        v.lastBooked = 'Recently completed';
        mem.vehicles.set(v.id!, { ...v });
      }
    }
    emitBookings();
    emitVehicles();
  },

  onOwnerBookingsChange(ownerId: string, callback: (bookings: FirebaseBooking[]) => void): Unsubscribe {
    if (!listeners.ownerBookings.has(ownerId)) listeners.ownerBookings.set(ownerId, new Set());
    const set = listeners.ownerBookings.get(ownerId)!;
    set.add(callback);
    callback(Array.from(mem.bookings.values()).filter(b => b.ownerId === ownerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    return () => set.delete(callback);
  },

  onRenterBookingsChange(renterId: string, callback: (bookings: FirebaseBooking[]) => void): Unsubscribe {
    if (!listeners.renterBookings.has(renterId)) listeners.renterBookings.set(renterId, new Set());
    const set = listeners.renterBookings.get(renterId)!;
    set.add(callback);
    callback(Array.from(mem.bookings.values()).filter(b => b.renterId === renterId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    return () => set.delete(callback);
  }
};

export const profileService = {
  async updateOwnerStats(_ownerId: string, _updates: { totalVehicles?: number; totalEarnings?: number; averageRating?: number; }): Promise<void> {
    return; // no-op in memory
  },
  async updateUserStats(_userId: string, _updates: { totalRides?: number; totalSpent?: number; averageRating?: number; }): Promise<void> {
    return; // no-op in memory
  },
  async getOwnerProfile(_ownerId: string) {
    return null; // not persisted in memory service
  },
  async getUserProfile(_userId: string) {
    return null;
  }
};
