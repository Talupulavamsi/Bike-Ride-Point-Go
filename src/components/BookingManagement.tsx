
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, Clock, MapPin, Phone, CheckCircle, XCircle } from "lucide-react";
import { useVehicleStore } from "@/hooks/useVehicleStore";
import { useToast } from "@/hooks/use-toast";

const BookingManagement = () => {
  const { bookings, updateBookingStatus, stats } = useVehicleStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  const handleStatusUpdate = (bookingId: string, newStatus: "active" | "completed") => {
    updateBookingStatus(bookingId, newStatus);
    toast({
      title: "Booking Updated",
      description: `Booking status changed to ${newStatus}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'active': return bookings.filter(b => b.status === 'active');
      case 'upcoming': return bookings.filter(b => b.status === 'upcoming');
      case 'completed': return bookings.filter(b => b.status === 'completed');
      default: return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="space-y-6">
      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Bookings</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'upcoming').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Booking Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Bookings ({bookings.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({bookings.filter(b => b.status === 'active').length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({bookings.filter(b => b.status === 'upcoming').length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({bookings.filter(b => b.status === 'completed').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No {activeTab === 'all' ? 'bookings' : activeTab + ' bookings'} found</h3>
                  <p className="text-gray-600">
                    {activeTab === 'all' 
                      ? 'Your booking history will appear here when customers book your vehicles.'
                      : `No ${activeTab} bookings at the moment.`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-rental-teal-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-rental-teal-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-rental-teal-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-rental-navy-800">{booking.renterName}</h4>
                              <p className="text-sm text-rental-navy-500">{booking.vehicleName}</p>
                              <div className="flex items-center space-x-3 mt-1">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{booking.pickupTime}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>{booking.duration}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <p className="font-semibold text-rental-navy-800 text-lg">{booking.amount}</p>
                            <Badge 
                              className={`${getStatusColor(booking.status)} text-white`}
                            >
                              {booking.status.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="flex flex-col space-y-2">
                            {booking.status === 'upcoming' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(booking.id, 'active')}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                Mark Active
                              </Button>
                            )}
                            {booking.status === 'active' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(booking.id, 'completed')}
                              >
                                Complete
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingManagement;
