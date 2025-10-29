
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Car, Bike, MapPin, Star, Calendar as CalendarIcon, Clock, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAppStore } from "@/hooks/useAppStore";
import { useRenterStore } from "@/hooks/useRenterStore";

const BookingInterface = () => {
  const { toast } = useToast();
  const { getAvailableVehicles, isVehicleAvailable, cancelBooking } = useAppStore();
  const { addBooking, getActiveBookings, getBookingHistory, renter } = useRenterStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"browse" | "bookings">("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleVehicles, setVisibleVehicles] = useState(10);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [availabilityText, setAvailabilityText] = useState<string>("");

  // Filter available vehicles based on search query
  const filteredVehicles = getAvailableVehicles().filter(vehicle => 
    vehicle.isAvailable && (
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const availableVehicles = filteredVehicles.slice(0, visibleVehicles);
  const activeBookings = getActiveBookings();
  const bookingHistory = getBookingHistory();

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

  const computeEndDate = (start: Date, duration: string): Date => {
    const end = new Date(start);
    const parts = duration.split(" ");
    const qty = parseInt(parts[0], 10);
    const unit = parts[1];
    if (isNaN(qty)) return end;
    if (unit.startsWith("hour")) {
      end.setHours(end.getHours() + qty);
    } else if (unit.startsWith("day")) {
      end.setDate(end.getDate() + qty - 1); // inclusive day range
    } else if (unit.startsWith("week")) {
      end.setDate(end.getDate() + qty * 7 - 1);
    }
    return end;
  };

  const handleBookVehicle = async () => {
    if (!selectedVehicle || !selectedDate || !selectedDuration || !renter) {
      toast({
        title: "Error",
        description: "Please select vehicle, date, and duration",
        variant: "destructive"
      });
      return;
    }

    const start = selectedDate;
    const end = computeEndDate(selectedDate, selectedDuration);

    const availability = await isVehicleAvailable(selectedVehicle.id, start, end);
    if (!availability.ok) {
      const cs = availability.conflict?.startDate ? format(availability.conflict.startDate, "PPP") : "start";
      const ce = availability.conflict?.endDate ? format(availability.conflict.endDate, "PPP") : "end";
      toast({
        title: "Not Available",
        description: `The vehicle is already booked for these dates (${cs} to ${ce}). Choose another date or vehicle.`,
        variant: "destructive"
      });
      return;
    }

    const totalAmount = calculateTotal(selectedVehicle.price, selectedDuration);
    
    // Create booking
    const newBooking = await addBooking({
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      vehicleType: selectedVehicle.type,
      ownerName: selectedVehicle.ownerName,
      ownerId: selectedVehicle.ownerId,
      startDate: start,
      endDate: end,
      pickupTime: `${format(start, "PPP")} - ${format(end, "PPP")}`,
      duration: selectedDuration,
      totalAmount,
      status: "upcoming",
      location: selectedVehicle.location
    });

    // Reset form
    setSelectedVehicle(null);
    setSelectedDate(undefined);
    setSelectedDuration("");
    setDetailsOpen(false);
    
    // Show success message with animation
    toast({
      title: "🎉 Booking Confirmed!",
      description: `Booking confirmed from ${format(start, "PPP")} to ${format(end, "PPP")}.`
    });

    // Automatically switch to bookings tab
    setTimeout(() => {
      setActiveTab("bookings");
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "upcoming": return "bg-blue-500";
      case "completed": return "bg-gray-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleShowMore = () => {
    setVisibleVehicles(prev => Math.min(prev + 10, filteredVehicles.length));
  };

  const markAsCompleted = (bookingId: string) => {
    // Simulate completing a booking (in real app, this would be triggered by time or user action)
    const { updateBookingStatus } = useRenterStore();
    updateBookingStatus(bookingId, "completed");
    
    toast({
      title: "Ride Completed!",
      description: "Your booking has been moved to history."
    });
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
          My Bookings ({activeBookings.length})
        </Button>
      </div>

      {/* Browse Vehicles Tab */}
      {activeTab === "browse" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicle List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Available Vehicles</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search vehicles, types, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            
            {searchQuery && (
              <p className="text-sm text-gray-600">
                Found {filteredVehicles.length} vehicles matching "{searchQuery}"
              </p>
            )}

            {availableVehicles.length > 0 ? (
              <>
                {availableVehicles.map((vehicle) => (
                  <Card 
                    key={vehicle.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedVehicle?.id === vehicle.id ? 'border-rental-teal-500 bg-rental-teal-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setSelectedDate(undefined);
                      setSelectedDuration("");
                      setAvailabilityText("");
                      setDetailsOpen(true);
                    }}
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
                              <span>{vehicle.location}</span>
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span>{vehicle.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{vehicle.price}</p>
                          <p className="text-sm text-gray-600">per day</p>
                          <Badge variant="secondary" className="mt-1">Available</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredVehicles.length > visibleVehicles && (
                  <div className="flex justify-center">
                    <Button variant="outline" onClick={handleShowMore}>
                      Show More ({filteredVehicles.length - visibleVehicles} remaining)
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No vehicles available</p>
                  <p className="text-sm">Try searching with different keywords or check back later</p>
                </CardContent>
              </Card>
            )}
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
                    <label className="block text-sm font-medium mb-2">Select Start Date</label>
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
                          onSelect={(d) => {
                            setSelectedDate(d);
                          }}
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
                  {selectedDuration && selectedDate && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span>₹{selectedVehicle.price}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{selectedDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dates:</span>
                        <span>
                          {format(selectedDate, "PPP")} → {selectedDuration ? format(computeEndDate(selectedDate, selectedDuration), "PPP") : format(selectedDate, "PPP")}
                        </span>
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

      {/* Vehicle Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedVehicle?.name || 'Vehicle Details'}</DialogTitle>
            <DialogDescription>
              {availabilityText || 'Select a start date to check availability.'}
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Type:</span> <span className="font-medium">{selectedVehicle.type}</span></div>
                <div><span className="text-gray-500">Location:</span> <span className="font-medium">{selectedVehicle.location}</span></div>
                <div><span className="text-gray-500">Model:</span> <span className="font-medium">{selectedVehicle.model || 'N/A'}</span></div>
                <div><span className="text-gray-500">CC:</span> <span className="font-medium">{selectedVehicle.cc || 'N/A'}</span></div>
                <div><span className="text-gray-500">Color:</span> <span className="font-medium">{selectedVehicle.color || 'N/A'}</span></div>
                <div><span className="text-gray-500">Rent/Day:</span> <span className="font-medium">₹{selectedVehicle.price}</span></div>
              </div>
              {selectedVehicle.description && (
                <p className="text-sm text-gray-700">{selectedVehicle.description}</p>
              )}

              {/* Inline booking controls inside dialog */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Start Date</label>
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
                        onSelect={async (d) => {
                          setSelectedDate(d);
                          // Check same-day availability hint
                          if (selectedVehicle && d) {
                            const res = await isVehicleAvailable(selectedVehicle.id, d, d);
                            if (!res.ok && res.conflict) {
                              setAvailabilityText(`This vehicle is booked from ${format(res.conflict.startDate, 'PPP')} to ${format(res.conflict.endDate, 'PPP')}. It is not available during these dates.`);
                            } else {
                              setAvailabilityText('Available');
                            }
                          }
                        }}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

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

                {selectedDuration && selectedDate && (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex justify-between">
                      <span>Dates:</span>
                      <span>{format(selectedDate, 'PPP')} → {format(computeEndDate(selectedDate, selectedDuration), 'PPP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>₹{calculateTotal(selectedVehicle.price, selectedDuration)}</span>
                    </div>
                  </div>
                )}

                <Button className="w-full" disabled={!selectedDate || !selectedDuration} onClick={handleBookVehicle}>
                  {availabilityText && availabilityText !== 'Available' ? 'Not Available' : 'Book Now'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* My Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="space-y-6">
          {activeBookings.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Bookings</h3>
              {activeBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-rental-teal-100 rounded-lg flex items-center justify-center">
                          {getVehicleIcon(booking.vehicleType)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{booking.vehicleName}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{booking.location}</span>
                            <Clock className="w-3 h-3" />
                            <span>{booking.duration}</span>
                          </div>
                          <p className="text-xs text-gray-500">Booked: {booking.pickupTime}</p>
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
                        {booking.status === "active" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => markAsCompleted(booking.id)}
                          >
                            Complete Ride
                          </Button>
                        )}
                        {(booking.status === "upcoming" || booking.status === "active") && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="mt-2 ml-2"
                            onClick={async () => {
                              const ok = window.confirm('Are you sure you want to cancel?');
                              if (!ok) return;
                              await cancelBooking({ id: booking.id, vehicleId: booking.vehicleId, slotId: (booking as any).slotId, slotIds: (booking as any).slotIds });
                            }}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active bookings</p>
                <p className="text-sm">Browse vehicles to make your first booking</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingInterface;
