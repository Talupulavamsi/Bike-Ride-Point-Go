
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Bike, MapPin, Star, Trash2, Plus, TrendingUp, Clock } from "lucide-react";
import VehicleManagementModal from "./VehicleManagementModal";
import { useToast } from "@/hooks/use-toast";
import { useVehicleStore } from "@/hooks/useVehicleStore";

const VehicleOwnerProfile = () => {
  const { toast } = useToast();
  const { vehicles, removeVehicle, updateVehicle, stats } = useVehicleStore();

  const getVehicleIcon = (type: string) => {
    return type === 'car' ? <Car className="w-5 h-5" /> : <Bike className="w-5 h-5" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bike': return 'bg-rental-teal-500';
      case 'car': return 'bg-rental-lime-500';
      case 'scooter': return 'bg-rental-trust-blue';
      default: return 'bg-rental-teal-500';
    }
  };

  const handleRemoveVehicle = (vehicleId: string, vehicleName: string) => {
    removeVehicle(vehicleId);
    toast({
      title: "Vehicle Removed",
      description: `${vehicleName} has been removed from your fleet`
    });
  };

  const toggleAvailability = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      updateVehicle(vehicleId, { isAvailable: !vehicle.isAvailable });
      toast({
        title: "Status Updated",
        description: `${vehicle.name} is now ${vehicle.isAvailable ? 'unavailable' : 'available'}`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rental-teal-100 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-rental-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold">{stats.totalVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">₹{stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vehicles" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="vehicles">My Vehicles ({vehicles.length})</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <VehicleManagementModal
            trigger={
              <Button className="bg-rental-teal-500 hover:bg-rental-teal-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            }
          />
        </div>

        <TabsContent value="vehicles" className="space-y-4">
          {vehicles.length > 0 ? (
            <div className="grid gap-4">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg ${getTypeColor(vehicle.type)} flex items-center justify-center text-white`}>
                          {getVehicleIcon(vehicle.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                            <Badge variant={vehicle.isAvailable ? "default" : "secondary"}>
                              {vehicle.isAvailable ? "Available" : "Booked"}
                            </Badge>
                            {vehicle.isAvailable && (
                              <Badge className="bg-rental-trust-green text-white">
                                Ready for Booking
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{vehicle.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span>{vehicle.rating}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              GPS: {vehicle.gpsStatus}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Price</p>
                              <p className="font-semibold">₹{vehicle.price}/day</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total Bookings</p>
                              <p className="font-semibold">{vehicle.totalBookings}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Earnings</p>
                              <p className="font-semibold">₹{vehicle.totalEarnings.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAvailability(vehicle.id)}
                        >
                          {vehicle.isAvailable ? "Mark Unavailable" : "Mark Available"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveVehicle(vehicle.id, vehicle.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500">
                        Last booked: {vehicle.lastBooked}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
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
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                {vehicles.length > 0 ? (
                  <div className="space-y-3">
                    {vehicles
                      .sort((a, b) => b.totalEarnings - a.totalEarnings)
                      .slice(0, 3)
                      .map((vehicle, index) => (
                        <div key={vehicle.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-rental-teal-100 rounded-full flex items-center justify-center text-xs font-semibold">
                              {index + 1}
                            </div>
                            <span className="font-medium">{vehicle.name}</span>
                          </div>
                          <span className="text-sm font-semibold">₹{vehicle.totalEarnings}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No performance data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vehicle Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Available Vehicles</span>
                    <span className="font-semibold text-green-600">
                      {stats.availableVehicles}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currently Booked</span>
                    <span className="font-semibold text-blue-600">
                      {stats.totalVehicles - stats.availableVehicles}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilization Rate</span>
                    <span className="font-semibold">
                      {stats.totalVehicles > 0 
                        ? Math.round(((stats.totalVehicles - stats.availableVehicles) / stats.totalVehicles) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleOwnerProfile;
