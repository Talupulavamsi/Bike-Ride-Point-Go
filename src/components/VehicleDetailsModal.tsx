
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { 
  Car, Bike, MapPin, Star, Battery, Clock, Shield, 
  Navigation, Phone, MessageCircle, Calendar 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    totalDays: 1
  });
  const { toast } = useToast();

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

  const calculateTotalPrice = () => {
    return vehicle.price * bookingData.totalDays;
  };

  const handleDateChange = (field: string, value: string) => {
    setBookingData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calculate total days when both dates are set
      if (updated.startDate && updated.endDate) {
        const start = new Date(updated.startDate);
        const end = new Date(updated.endDate);
        const timeDiff = end.getTime() - start.getTime();
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        updated.totalDays = dayDiff > 0 ? dayDiff : 1;
      }
      
      return updated;
    });
  };

  const handleBookingSubmit = () => {
    if (!bookingData.startDate || !bookingData.endDate || !bookingData.startTime || !bookingData.endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all booking details.",
        variant: "destructive",
      });
      return;
    }

    // Simulate booking process
    toast({
      title: "Booking Confirmed!",
      description: `Your ${vehicle.name} has been booked for ${bookingData.totalDays} day(s). Total: ₹${calculateTotalPrice()}`,
    });
    
    console.log('Booking submitted:', {
      vehicleId: vehicle.id,
      ...bookingData,
      totalPrice: calculateTotalPrice()
    });
    
    onClose();
  };

  const handleBookNow = () => {
    setShowBookingForm(true);
  };

  if (showBookingForm) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>Book {vehicle.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Vehicle Summary */}
            <Card className="bg-rental-teal-50 border-rental-teal-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${getTypeColor()} flex items-center justify-center text-white`}>
                    {getVehicleIcon()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{vehicle.name}</h3>
                    <p className="text-sm text-rental-navy-600">₹{vehicle.price}/day</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={bookingData.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Pickup Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) => handleDateChange('startTime', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Return Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={bookingData.endTime}
                  onChange={(e) => handleDateChange('endTime', e.target.value)}
                />
              </div>
            </div>

            {/* Pricing Summary */}
            <Card className="bg-rental-trust-green/5 border-rental-trust-green/20">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span>{bookingData.totalDays} day(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rate per day:</span>
                    <span>₹{vehicle.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Security Deposit:</span>
                    <span>₹{vehicle.price * 2}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-rental-navy-500">
                    <span>Total + Deposit:</span>
                    <span>₹{calculateTotalPrice() + (vehicle.price * 2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowBookingForm(false)}
                className="flex-1"
              >
                Back to Details
              </Button>
              <Button 
                onClick={handleBookingSubmit}
                className="flex-1 bg-rental-teal-500 hover:bg-rental-teal-600 text-white"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
                  Book This Vehicle
                </Button>
                <Button variant="outline" className="w-full">
                  Add to Favorites
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
