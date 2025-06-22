
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Filter } from "lucide-react";
import VehicleCard from "./VehicleCard";

const VehicleDiscovery = () => {
  const mockVehicles = [
    {
      id: '1',
      type: 'bike' as const,
      name: 'Hero Splendor Plus',
      location: { lat: 12.9716, lng: 77.5946, address: 'MG Road, Bangalore' },
      price: 150,
      rating: 4.8,
      distance: 0.3,
      isAvailable: true,
      isOnline: true,
      owner: 'Rajesh Kumar',
      features: ['Helmet Included', 'GPS Enabled', 'Full Tank'],
      image: '/placeholder.svg'
    },
    {
      id: '2',
      type: 'car' as const,
      name: 'Maruti Swift',
      location: { lat: 12.9756, lng: 77.5985, address: 'Brigade Road, Bangalore' },
      price: 800,
      rating: 4.6,
      distance: 0.8,
      isAvailable: true,
      isOnline: true,
      owner: 'Priya Singh',
      features: ['AC', 'GPS', 'Bluetooth', 'Full Tank'],
      image: '/placeholder.svg'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Nearby Vehicles</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onClick={() => console.log('Vehicle clicked:', vehicle.id)}
              userRole="renter"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleDiscovery;
