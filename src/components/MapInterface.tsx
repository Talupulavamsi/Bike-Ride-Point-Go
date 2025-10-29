
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Car, Bike, Search, Navigation, Clock, Battery, Star, Filter } from "lucide-react";
import VehicleCard from "@/components/VehicleCard";
import VehicleDetailsModal from "@/components/VehicleDetailsModal";
import { useAppStore } from "@/hooks/useAppStore";

interface MapInterfaceProps {
  userRole: 'renter' | 'owner' | null;
}

interface Vehicle {
  id: string;
  type: 'bike' | 'car' | 'scooter';
  name: string;
  location: { lat: number; lng: number; address: string };
  price: number;
  rating: number;
  distance: number;
  battery?: number;
  isAvailable: boolean;
  isOnline: boolean;
  owner: string;
  features: string[];
  image: string;
}
const MapInterface = ({ userRole }: MapInterfaceProps) => {
  const { getAvailableVehicles } = useAppStore();
  const available = getAvailableVehicles();
  const mapped: Vehicle[] = available.map(v => ({
    id: v.id,
    type: v.type,
    name: v.name,
    location: { lat: 12.9716, lng: 77.5946, address: v.location },
    price: v.price,
    rating: v.rating ?? 0,
    distance: 0,
    isAvailable: v.isAvailable,
    isOnline: v.gpsStatus === 'active',
    owner: v.ownerName,
    features: v.features || [],
    image: v.image || '/placeholder.svg',
  }));
  const [vehicles, setVehicles] = useState<Vehicle[]>(mapped);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'bike' | 'car' | 'scooter'>('all');
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const next = getAvailableVehicles().map(v => ({
      id: v.id,
      type: v.type,
      name: v.name,
      location: { lat: 12.9716, lng: 77.5946, address: v.location },
      price: v.price,
      rating: v.rating ?? 0,
      distance: 0,
      isAvailable: v.isAvailable,
      isOnline: v.gpsStatus === 'active',
      owner: v.ownerName,
      features: v.features || [],
      image: v.image || '/placeholder.svg',
    }));
    setVehicles(next);
  }, [getAvailableVehicles]);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || vehicle.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getVehicleIcon = (type: string, isAvailable: boolean) => {
    const iconClass = `w-6 h-6 ${isAvailable ? 'text-white' : 'text-gray-400'}`;
    switch (type) {
      case 'bike': return <Bike className={iconClass} />;
      case 'car': return <Car className={iconClass} />;
      case 'scooter': return <Bike className={iconClass} />;
      default: return <Car className={iconClass} />;
    }
  };

  const getVehicleColor = (type: string, isAvailable: boolean) => {
    if (!isAvailable) return 'bg-gray-400';
    switch (type) {
      case 'bike': return 'bg-rental-teal-500';
      case 'car': return 'bg-rental-lime-500';
      case 'scooter': return 'bg-rental-trust-blue';
      default: return 'bg-rental-teal-500';
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-96' : 'w-0'} transition-all duration-300 overflow-hidden bg-white shadow-lg z-10`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-rental-teal-500 to-rental-lime-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white">RidePoint</h2>
                  <p className="text-xs text-white/80">
                    {userRole === 'renter' ? 'Find Vehicles' : 'Manage Fleet'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(false)}
                className="text-white hover:bg-white/20"
              >
                ←
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search vehicles or locations..."
                className="pl-10 bg-white/90"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b">
            <div className="flex space-x-2">
              {['all', 'bike', 'car', 'scooter'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter as any)}
                  className={`capitalize ${
                    selectedFilter === filter 
                      ? 'bg-rental-teal-500 hover:bg-rental-teal-600' 
                      : ''
                  }`}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Vehicle List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onClick={() => setSelectedVehicle(vehicle)}
                userRole={userRole}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Map Toggle */}
        {!showSidebar && (
          <Button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-20 bg-white shadow-lg hover:bg-gray-50"
            variant="outline"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        )}

        {/* Mock Map with Vehicle Pins */}
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
              {Array.from({ length: 400 }).map((_, i) => (
                <div key={i} className="border border-gray-300"></div>
              ))}
            </div>
          </div>

          {/* Vehicle Pins */}
          {filteredVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="absolute animate-pin-bounce cursor-pointer group"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + index * 10}%`,
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => setSelectedVehicle(vehicle)}
            >
              <div className={`w-12 h-12 rounded-full ${getVehicleColor(vehicle.type, vehicle.isAvailable)} 
                              shadow-lg flex items-center justify-center transform group-hover:scale-110 
                              transition-transform border-2 border-white`}>
                {getVehicleIcon(vehicle.type, vehicle.isAvailable)}
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 
                              rounded shadow-lg text-xs font-medium opacity-0 group-hover:opacity-100 
                              transition-opacity whitespace-nowrap">
                ₹{vehicle.price}/day
              </div>
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 space-y-2">
            <Button className="w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50" variant="outline">
              <Navigation className="w-5 h-5" />
            </Button>
            <Button className="w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50" variant="outline">
              +
            </Button>
            <Button className="w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50" variant="outline">
              -
            </Button>
          </div>

          {/* Current Location Indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-rental-trust-blue rounded-full shadow-lg border-2 border-white animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default MapInterface;
