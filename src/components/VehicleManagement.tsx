
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Car, 
  Bike, 
  Plus, 
  Edit, 
  MapPin, 
  ToggleLeft, 
  ToggleRight, 
  DollarSign,
  TrendingUp,
  Battery,
  Star
} from "lucide-react";
import { useVehicleStore } from "@/hooks/useVehicleStore";
import { useToast } from "@/hooks/use-toast";
import VehicleManagementModal from "./VehicleManagementModal";

const VehicleManagement = () => {
  const { vehicles, updateVehicle } = useVehicleStore();
  const { toast } = useToast();

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

  const toggleVehicleOnline = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      updateVehicle(vehicleId, { isAvailable: !vehicle.isAvailable });
      toast({
        title: "Status Updated",
        description: `${vehicle.name} is now ${vehicle.isAvailable ? 'offline' : 'online'}`
      });
    }
  };

  const acceptSuggestedPrice = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      // Since we don't have suggestedPrice in our store, we'll simulate a 10% increase
      const suggestedPrice = Math.round(vehicle.price * 1.1);
      updateVehicle(vehicleId, { price: suggestedPrice });
      toast({
        title: "Price Updated",
        description: `${vehicle.name} price updated to ₹${suggestedPrice}/day`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-rental-navy-800">Vehicle Management</h2>
          <p className="text-rental-navy-600">Manage your fleet with AI-powered insights</p>
        </div>
        <VehicleManagementModal
          trigger={
            <Button className="bg-rental-teal-500 hover:bg-rental-teal-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          }
        />
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Car className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No vehicles listed yet</h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first vehicle to begin earning
            </p>
            <VehicleManagementModal
              trigger={
                <Button className="bg-rental-teal-500 hover:bg-rental-teal-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Vehicle
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            const suggestedPrice = Math.round(vehicle.price * 1.1);
            return (
              <Card key={vehicle.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${getTypeColor(vehicle.type)} flex items-center justify-center text-white`}>
                        {getVehicleIcon(vehicle.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-rental-navy-800">{vehicle.name}</h3>
                        <p className="text-sm text-rental-navy-500 capitalize">{vehicle.type}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVehicleOnline(vehicle.id)}
                      className="p-1"
                    >
                      {vehicle.isAvailable ? (
                        <ToggleRight className="w-6 h-6 text-rental-trust-green" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {vehicle.isAvailable && (
                        <div className="w-2 h-2 bg-rental-trust-green rounded-full"></div>
                      )}
                      <Badge variant={vehicle.isAvailable ? "default" : "secondary"}>
                        {vehicle.isAvailable ? 'Available' : 'Booked'}
                      </Badge>
                      {vehicle.isAvailable && (
                        <Badge className="bg-rental-trust-green text-white">
                          Ready for Booking
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-rental-navy-600">{vehicle.rating}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-rental-navy-400" />
                    <span className="text-sm text-rental-navy-600">{vehicle.location}</span>
                  </div>

                  {/* GPS Status */}
                  <div className="flex items-center space-x-2">
                    <Battery className="w-4 h-4 text-rental-trust-green" />
                    <span className="text-sm text-rental-navy-600">GPS: {vehicle.gpsStatus}</span>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-rental-navy-600">Current Price</span>
                      <span className="font-semibold text-rental-navy-800">₹{vehicle.price}/day</span>
                    </div>
                    {suggestedPrice !== vehicle.price && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-rental-trust-green" />
                          <span className="text-xs text-rental-trust-green">AI Suggests</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-rental-trust-green">₹{suggestedPrice}/day</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-6 text-xs"
                            onClick={() => acceptSuggestedPrice(vehicle.id)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-rental-navy-800">{vehicle.totalBookings}</p>
                      <p className="text-xs text-rental-navy-500">Total Bookings</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-rental-navy-800">₹{vehicle.totalEarnings.toLocaleString()}</p>
                      <p className="text-xs text-rental-navy-500">Total Earnings</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      Track
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
