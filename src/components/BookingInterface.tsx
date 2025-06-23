
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Bike, MapPin, Star, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Vehicle {
  id: string;
  name: string;
  type: "bike" | "car" | "scooter";
  price: number;
  location: string;
  rating: number;
  distance: number;
  isAvailable: boolean;
  owner: string;
  features: string[];
  image: string;
}

interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  totalAmount: number;
  status: "active" | "completed" | "cancelled";
}

const BookingInterface = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [activeTab, setActiveTab] = useState<"browse" | "bookings">("browse");
  
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      vehicleId: "1",
      vehicleName: "Hero Splendor Plus",
      startDate: new Date(),
      endDate: new Date(),
      duration: "2 hours",
      totalAmount: 300,
      status: "active"
    }
  ]);

  const availableVehicles: Vehicle[] = [
    {
      id: "1",
      name: "Hero Splendor Plus",
      type: "bike",
      price: 150,
      location: "MG Road, Bangalore",
      rating: 4.8,
      distance: 0.3,
      isAvailable: true,
      owner: "Rajesh Kumar",
      features: ["Helmet Included", "GPS Enabled", "Full Tank"],
      image: "/placeholder.svg"
    },
    {
      id: "2",
      name: "Maruti Swift",
      type: "car",
      price: 800,
      location: "Brigade Road, Bangalore",
      rating: 4.6,
      distance: 0.8,
      isAvailable: true,
      owner: "Priya Singh",
      features: ["AC", "GPS", "Bluetooth", "Full Tank"],
      image: "/placeholder.svg"
    },
    {
      id: "3",
      name: "Ather 450X",
      type: "scooter",
      price: 200,
      location: "Commercial Street, Bangalore",
      rating: 4.9,
      distance: 0.5,
      isAvailable: true,
      owner: "Amit Sharma",
      features: ["Electric", "GPS", "Fast Charging"],
      image: "/placeholder.svg"
    }
  ];

  const getVehicleIcon = (type: "bike" | "car" | "scooter") => {
    return type === "car" ? <Car className="w-5 h-5" /> : <Bike className="w-5 h-5" />;
  };

  const calculateTotal = (basePrice: number, duration: string) => {
    const hours = parseInt(duration.split(" ")[0]);
    if (duration.includes("hour")) {
      return Math.round((basePrice / 24) * hours);
    } else if (duration.includes("day")) {
      return basePrice * hours;
    }
    return basePrice;
  };

  const handleBookVehicle = () => {
    if (!selectedVehicle || !selectedDate || !selectedDuration) {
      toast({
        title: "Error",
        description: "Please select vehicle, date, and duration",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = calculateTotal(selectedVehicle.price, selectedDuration);
    const newBooking: Booking = {
      id: Date.now().toString(),
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      startDate: selectedDate,
      endDate: selectedDate,
      duration: selectedDuration,
      totalAmount,
      status: "active"
    };

    setBookings([...bookings, newBooking]);
    setSelectedVehicle(null);
    setSelectedDate(undefined);
    setSelectedDuration("");
    
    toast({
      title: "Booking Confirmed!",
      description: `${selectedVehicle.name} booked for ${selectedDuration}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "completed": return "bg-blue-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-rental-navy-800">Vehicle Booking</h2>
          <p className="text-rental-navy-600">Find and book vehicles near you</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === "browse" ? "default" : "outline"}
          onClick={() => setActiveTab("browse")}
        >
          Browse Vehicles
        </Button>
        <Button
          variant={activeTab === "bookings" ? "default" : "outline"}
          onClick={() => setActiveTab("bookings")}
        >
          My Bookings ({bookings.length})
        </Button>
      </div>

      {/* Browse Vehicles Tab */}
      {activeTab === "browse" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicle List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Vehicles</h3>
            {availableVehicles.map((vehicle) => (
              <Card 
                key={vehicle.id} 
                className={`cursor-pointer transition-all ${
                  selectedVehicle?.id === vehicle.id ? 'border-rental-teal-500 bg-rental-teal-50' : ''
                }`}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-rental-teal-100 rounded-lg flex items-center justify-center">
                        {getVehicleIcon(vehicle.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{vehicle.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{vehicle.distance}km away</span>
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{vehicle.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{vehicle.price}</p>
                      <p className="text-sm text-gray-600">per day</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {vehicle.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Book Your Vehicle</h3>
            {selectedVehicle ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedVehicle.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Picker */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Duration Picker */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <Select onValueChange={setSelectedDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2 hours">2 hours</SelectItem>
                        <SelectItem value="4 hours">4 hours</SelectItem>
                        <SelectItem value="8 hours">8 hours</SelectItem>
                        <SelectItem value="1 day">1 day</SelectItem>
                        <SelectItem value="2 days">2 days</SelectItem>
                        <SelectItem value="1 week">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Calculation */}
                  {selectedDuration && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span>₹{selectedVehicle.price}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{selectedDuration}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span>₹{calculateTotal(selectedVehicle.price, selectedDuration)}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleBookVehicle} 
                    className="w-full"
                    disabled={!selectedDate || !selectedDuration}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a vehicle to start booking</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* My Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Bookings</h3>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-rental-teal-100 rounded-lg flex items-center justify-center">
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{booking.vehicleName}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>{booking.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)}`}></div>
                          <Badge variant={booking.status === "active" ? "default" : "secondary"}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="font-bold">₹{booking.totalAmount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No bookings yet</p>
                <p className="text-sm">Start browsing vehicles to make your first booking</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingInterface;
