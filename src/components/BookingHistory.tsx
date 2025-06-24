
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Car, Bike, Star, Calendar } from "lucide-react";
import { useRenterStore } from "@/hooks/useRenterStore";
import { format } from "date-fns";

const BookingHistory = () => {
  const { getBookingHistory } = useRenterStore();
  const bookingHistory = getBookingHistory();

  const getVehicleIcon = (type: "bike" | "car" | "scooter") => {
    return type === "car" ? <Car className="w-5 h-5" /> : <Bike className="w-5 h-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-rental-navy-500" />
          <span>Booking History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookingHistory.length > 0 ? (
          <div className="space-y-4">
            {bookingHistory.map((booking) => (
              <Card key={booking.id} className="border-l-4 border-l-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getVehicleIcon(booking.vehicleType)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{booking.vehicleName}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{booking.location}</span>
                          <Clock className="w-3 h-3" />
                          <span>{booking.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>Booked: {format(new Date(booking.bookingDate), "MMM dd, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)}`}></div>
                        <Badge variant={getStatusVariant(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="font-bold text-gray-800">₹{booking.totalAmount}</p>
                      {booking.status === "completed" && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">Rate this ride</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {booking.status === "completed" && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-green-600 font-medium">
                        ✅ Ride completed successfully
                      </p>
                    </div>
                  )}
                  
                  {booking.status === "cancelled" && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-red-600 font-medium">
                        ❌ Booking was cancelled
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No booking history yet</p>
            <p className="text-sm">Your completed and cancelled rides will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingHistory;
