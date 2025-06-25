
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2 } from "lucide-react";
import VehicleCard from "./VehicleCard";
import { useAppStore } from "@/hooks/useAppStore";

const VehicleDiscovery = () => {
  const { getAvailableVehicles, loading } = useAppStore();
  const availableVehicles = getAvailableVehicles();

  // Transform vehicles to match VehicleCard interface
  const transformedVehicles = availableVehicles.map(vehicle => ({
    id: vehicle.id,
    type: vehicle.type,
    name: vehicle.name,
    location: { 
      lat: 12.9716, 
      lng: 77.5946, 
      address: vehicle.location 
    },
    price: vehicle.price,
    rating: vehicle.rating,
    distance: Math.random() * 2, // Mock distance
    isAvailable: vehicle.isAvailable && vehicle.status === 'available',
    isOnline: vehicle.gpsStatus === 'active',
    owner: vehicle.ownerName,
    features: vehicle.features,
    image: vehicle.image || '/placeholder.svg',
    status: vehicle.status
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Loading Vehicles...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-rental-teal-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Available Vehicles ({availableVehicles.length})</span>
          </div>
          <Badge className="bg-rental-trust-green text-white">
            Live Updates
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transformedVehicles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No vehicles available</p>
            <p className="text-sm">All vehicles are currently booked or new listings will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transformedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onClick={() => console.log('Vehicle clicked:', vehicle.id)}
                userRole="renter"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleDiscovery;
