
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Bike, MapPin, Star, Battery, Clock } from "lucide-react";

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

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
  userRole: 'renter' | 'owner' | null;
}

const VehicleCard = ({ vehicle, onClick, userRole }: VehicleCardProps) => {
  const getVehicleIcon = () => {
    switch (vehicle.type) {
      case 'bike': return <Bike className="w-5 h-5" />;
      case 'car': return <Car className="w-5 h-5" />;
      case 'scooter': return <Bike className="w-5 h-5" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  const getTypeColor = () => {
    switch (vehicle.type) {
      case 'bike': return 'bg-rental-teal-500';
      case 'car': return 'bg-rental-lime-500';
      case 'scooter': return 'bg-rental-trust-blue';
      default: return 'bg-rental-teal-500';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 
                  ${!vehicle.isAvailable ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Vehicle Type Icon */}
          <div className={`w-10 h-10 rounded-lg ${getTypeColor()} flex items-center justify-center text-white flex-shrink-0`}>
            {getVehicleIcon()}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-rental-navy-800 truncate">{vehicle.name}</h3>
                <p className="text-xs text-rental-navy-500">{vehicle.owner}</p>
              </div>
              <div className="flex items-center space-x-1">
                {vehicle.isOnline && (
                  <div className="w-2 h-2 bg-rental-trust-green rounded-full"></div>
                )}
                <Badge variant={vehicle.isAvailable ? "default" : "secondary"} className="text-xs">
                  {vehicle.isAvailable ? 'Available' : 'Busy'}
                </Badge>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-1 mb-2">
              <MapPin className="w-3 h-3 text-rental-navy-400" />
              <span className="text-xs text-rental-navy-600 truncate">{vehicle.location.address}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-rental-navy-600">{vehicle.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-rental-navy-400" />
                  <span className="text-rental-navy-600">{vehicle.distance}km</span>
                </div>
                {vehicle.battery && (
                  <div className="flex items-center space-x-1">
                    <Battery className="w-3 h-3 text-rental-trust-green" />
                    <span className="text-rental-navy-600">{vehicle.battery}%</span>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="font-bold text-rental-navy-800">₹{vehicle.price}</div>
                <div className="text-rental-navy-500">/day</div>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1 mt-2">
              {vehicle.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                  {feature}
                </Badge>
              ))}
              {vehicle.features.length > 2 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{vehicle.features.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
