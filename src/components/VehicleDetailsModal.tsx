
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Car, Bike, MapPin, Star, Battery, Clock, Shield, 
  Navigation, Phone, MessageCircle, Calendar 
} from "lucide-react";

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

interface VehicleDetailsModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  userRole: 'renter' | 'owner' | null;
}

const VehicleDetailsModal = ({ vehicle, onClose, userRole }: VehicleDetailsModalProps) => {
  const getVehicleIcon = () => {
    switch (vehicle.type) {
      case 'bike': return <Bike className="w-6 h-6" />;
      case 'car': return <Car className="w-6 h-6" />;
      case 'scooter': return <Bike className="w-6 h-6" />;
      default: return <Car className="w-6 h-6" />;
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

  const handleBookNow = () => {
    console.log('Booking vehicle:', vehicle.id);
    // Here you would implement the booking logic
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${getTypeColor()} flex items-center justify-center text-white`}>
              {getVehicleIcon()}
            </div>
            <div>
              <DialogTitle className="text-xl">{vehicle.name}</DialogTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={vehicle.isAvailable ? "default" : "secondary"}>
                  {vehicle.isAvailable ? 'Available' : 'Currently Rented'}
                </Badge>
                {vehicle.isOnline && (
                  <Badge variant="outline" className="text-rental-trust-green border-rental-trust-green">
                    <div className="w-2 h-2 bg-rental-trust-green rounded-full mr-1"></div>
                    Live GPS
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Image */}
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <img 
              src={`https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop`}
              alt={vehicle.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold">{vehicle.rating}</span>
              </div>
              <p className="text-xs text-rental-navy-600">Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <MapPin className="w-4 h-4 text-rental-navy-500" />
                <span className="font-semibold">{vehicle.distance}km</span>
              </div>
              <p className="text-xs text-rental-navy-600">Distance</p>
            </div>
            <div className="text-center">
              {vehicle.battery ? (
                <>
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Battery className="w-4 h-4 text-rental-trust-green" />
                    <span className="font-semibold">{vehicle.battery}%</span>
                  </div>
                  <p className="text-xs text-rental-navy-600">Battery</p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Clock className="w-4 h-4 text-rental-navy-500" />
                    <span className="font-semibold">5min</span>
                  </div>
                  <p className="text-xs text-rental-navy-600">Walk Time</p>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Location & Owner */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-rental-navy-800 mb-2 flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Current Location</span>
              </h3>
              <p className="text-sm text-rental-navy-600">{vehicle.location.address}</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>

            <div>
              <h3 className="font-semibold text-rental-navy-800 mb-2">Owner</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-rental-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {vehicle.owner.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.owner}</p>
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3 text-rental-trust-green" />
                      <span className="text-xs text-rental-trust-green">Verified Owner</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h3 className="font-semibold text-rental-navy-800 mb-3">Features & Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-rental-trust-green rounded-full"></div>
                  <span className="text-sm text-rental-navy-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <Card className="bg-rental-teal-50 border-rental-teal-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rental-navy-600">Rental Price</p>
                  <p className="text-2xl font-bold text-rental-navy-800">₹{vehicle.price}<span className="text-sm font-normal">/day</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-rental-navy-500">Security Deposit</p>
                  <p className="text-lg font-semibold text-rental-navy-700">₹{vehicle.price * 2}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {vehicle.isAvailable ? (
              <>
                <Button 
                  onClick={handleBookNow}
                  className="w-full bg-rental-teal-500 hover:bg-rental-teal-600 text-white py-3"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule for Later
                </Button>
              </>
            ) : (
              <Button disabled className="w-full py-3">
                Currently Not Available
              </Button>
            )}
          </div>

          {/* Safety Notice */}
          <Card className="bg-rental-trust-green/5 border-rental-trust-green/20">
            <CardContent className="p-3">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-rental-trust-green mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-rental-trust-green">Safety First</p>
                  <p className="text-xs text-rental-navy-600">
                    All vehicles are regularly sanitized and equipped with GPS tracking for your safety.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsModal;
