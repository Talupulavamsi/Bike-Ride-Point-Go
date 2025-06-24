
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Bike, MapPin, Star, Battery, Plus } from "lucide-react";
import { useVehicleStore } from "@/hooks/useVehicleStore";
import VehicleManagementModal from "./VehicleManagementModal";

const MyFleet = () => {
  const { vehicles } = useVehicleStore();

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return <Bike className="w-5 h-5" />;
      case 'car': return <Car className="w-5 h-5" />;
      case 'scooter': return <Bike className="w-5 h-5" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bike': return 'bg-rental-teal-500';
      case 'car': return 'bg-rental-lime-500';
      case 'scooter': return 'bg-rental-trust-blue';
      default: return 'bg-rental-teal-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-rental-navy-500" />
            <span>My Fleet ({vehicles.length})</span>
          </CardTitle>
          <VehicleManagementModal
            trigger={
              <Button size="sm" className="bg-rental-teal-500 hover:bg-rental-teal-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <div className="text-center py-8">
            <Car className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">You haven't added any vehicles yet</h3>
            <p className="text-gray-600 mb-4">
              Start earning by adding your first vehicle to the platform
            </p>
            <VehicleManagementModal
              trigger={
                <Button className="bg-rental-teal-500 hover:bg-rental-teal-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Vehicle
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${getTypeColor(vehicle.type)} flex items-center justify-center text-white`}>
                        {getVehicleIcon(vehicle.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-rental-navy-800">{vehicle.name}</h4>
                        <p className="text-sm text-rental-navy-500 capitalize">{vehicle.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-rental-navy-600">{vehicle.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-rental-navy-400" />
                      <span className="text-xs text-rental-navy-600">{vehicle.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Battery className="w-3 h-3 text-rental-trust-green" />
                      <span className="text-xs text-rental-navy-600">GPS: {vehicle.gpsStatus}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-rental-navy-600">Status</p>
                      <Badge variant={vehicle.isAvailable ? "default" : "secondary"}>
                        {vehicle.isAvailable ? 'Available' : 'Booked'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-rental-navy-600">Price</p>
                      <p className="font-semibold text-rental-navy-800">₹{vehicle.price}/day</p>
                    </div>
                  </div>

                  {vehicle.isAvailable && (
                    <Badge className="w-full bg-rental-trust-green text-white justify-center">
                      Ready for Booking
                    </Badge>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="text-xs text-rental-navy-500">Bookings</p>
                        <p className="font-semibold text-rental-navy-800">{vehicle.totalBookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-rental-navy-500">Earnings</p>
                        <p className="font-semibold text-rental-navy-800">₹{vehicle.totalEarnings}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyFleet;
