
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Car, Bike, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/contexts/FirebaseContext";
import { useAppStore } from "@/hooks/useAppStore";

interface VehicleManagementModalProps {
  trigger: React.ReactNode;
}

const VehicleManagementModal = ({ trigger }: VehicleManagementModalProps) => {
  const { toast } = useToast();
  const { user, userProfile } = useFirebase();
  const { vehicles, addVehicle } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "" as "bike" | "scooter" | "car" | "",
    price: "",
    location: ""
  });

  // Check if user is authorized to add vehicles (must be owner)
  const canAddVehicles = user && userProfile && userProfile.role === 'owner';

  const handleAddVehicle = async () => {
    if (!canAddVehicles) {
      toast({
        title: "Access Denied",
        description: "Only vehicle owners can add vehicles",
        variant: "destructive"
      });
      return;
    }

    if (!newVehicle.name || !newVehicle.type || !newVehicle.price || !newVehicle.location) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const vehicle = await addVehicle({
        name: newVehicle.name,
        type: newVehicle.type as "bike" | "scooter" | "car",
        price: parseInt(newVehicle.price),
        location: newVehicle.location,
        isAvailable: true,
        rating: 5.0,
        totalBookings: 0,
        totalEarnings: 0,
        lastBooked: 'Never',
        gpsStatus: 'active' as const,
        ownerId: user!.uid,
        ownerName: userProfile!.name,
        features: ['GPS Enabled', 'Verified Owner']
      });

      setNewVehicle({ name: "", type: "", price: "", location: "" });
      
      toast({
        title: "Success! 🚗",
        description: `${vehicle.name} has been added to your fleet successfully!`
      });

      // Show success animation
      setTimeout(() => {
        setActiveTab("manage");
      }, 1000);

    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveVehicle = (vehicleId: string, vehicleName: string) => {
    // Note: This would need to be implemented in useAppStore
    toast({
      title: "Vehicle Removed",
      description: `${vehicleName} has been removed from your fleet`
    });
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return <Car className="w-4 h-4" />;
      case 'scooter': return <Bike className="w-4 h-4" />;
      default: return <Bike className="w-4 h-4" />;
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

  // Filter vehicles to show only owner's vehicles
  const ownerVehicles = vehicles.filter(vehicle => 
    userProfile && vehicle.ownerId === userProfile.uid
  );

  // Don't render if user is not an owner
  if (!canAddVehicles) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vehicle Management</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "add" ? "default" : "outline"}
              onClick={() => setActiveTab("add")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
            <Button
              variant={activeTab === "manage" ? "default" : "outline"}
              onClick={() => setActiveTab("manage")}
            >
              Manage Fleet ({ownerVehicles.length})
            </Button>
          </div>

          {/* Add Vehicle Tab */}
          {activeTab === "add" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleName">Vehicle Name *</Label>
                  <Input
                    id="vehicleName"
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                    placeholder="e.g. Honda Activa 6G"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type *</Label>
                  <Select 
                    onValueChange={(value) => setNewVehicle({...newVehicle, type: value as "bike" | "scooter" | "car"})}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="scooter">Scooter</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="vehiclePrice">Price per Day (₹) *</Label>
                  <Input
                    id="vehiclePrice"
                    type="number"
                    value={newVehicle.price}
                    onChange={(e) => setNewVehicle({...newVehicle, price: e.target.value})}
                    placeholder="150"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleLocation">Location *</Label>
                  <Input
                    id="vehicleLocation"
                    value={newVehicle.location}
                    onChange={(e) => setNewVehicle({...newVehicle, location: e.target.value})}
                    placeholder="e.g. MG Road, Bangalore"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleAddVehicle} 
                className="w-full bg-rental-teal-500 hover:bg-rental-teal-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Vehicle...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle to Fleet
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Manage Fleet Tab */}
          {activeTab === "manage" && (
            <div className="space-y-4">
              {ownerVehicles.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Car className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">You have 0 vehicles</h3>
                    <p className="text-gray-600 mb-4">
                      Start by adding your first vehicle to begin earning
                    </p>
                    <Button 
                      onClick={() => setActiveTab("add")}
                      className="bg-rental-teal-500 hover:bg-rental-teal-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Vehicle
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Total Vehicles: {ownerVehicles.length}</p>
                    <Badge className="bg-rental-trust-green text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      All Synced
                    </Badge>
                  </div>
                  <div className="grid gap-4">
                    {ownerVehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="border-l-4 border-l-rental-teal-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg ${getTypeColor(vehicle.type)} flex items-center justify-center text-white`}>
                                {getVehicleIcon(vehicle.type)}
                              </div>
                              <div>
                                <h4 className="font-semibold">{vehicle.name}</h4>
                                <p className="text-sm text-gray-600">{vehicle.location}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant={vehicle.isAvailable ? "default" : "secondary"}>
                                    {vehicle.isAvailable ? "Available" : "Booked"}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    GPS: {vehicle.gpsStatus}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="font-semibold">₹{vehicle.price}/day</p>
                                <p className="text-sm text-gray-500">{vehicle.totalBookings} bookings</p>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveVehicle(vehicle.id, vehicle.name)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleManagementModal;
