
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Car, Bike } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  price: number;
  location: string;
  isAvailable: boolean;
}

interface VehicleManagementModalProps {
  trigger: React.ReactNode;
}

const VehicleManagementModal = ({ trigger }: VehicleManagementModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add");
  
  // Mock vehicles data - in real app this would come from a database
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      name: "Hero Splendor Plus",
      type: "bike",
      price: 150,
      location: "MG Road, Bangalore",
      isAvailable: true
    },
    {
      id: "2",
      name: "Maruti Swift",
      type: "car",
      price: 800,
      location: "Brigade Road, Bangalore",
      isAvailable: true
    }
  ]);

  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "",
    price: "",
    location: ""
  });

  const handleAddVehicle = () => {
    if (!newVehicle.name || !newVehicle.type || !newVehicle.price || !newVehicle.location) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    const vehicle: Vehicle = {
      id: Date.now().toString(),
      name: newVehicle.name,
      type: newVehicle.type,
      price: parseInt(newVehicle.price),
      location: newVehicle.location,
      isAvailable: true
    };

    setVehicles([...vehicles, vehicle]);
    setNewVehicle({ name: "", type: "", price: "", location: "" });
    
    toast({
      title: "Success",
      description: "Vehicle added successfully!"
    });
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    setVehicles(vehicles.filter(v => v.id !== vehicleId));
    toast({
      title: "Success",
      description: "Vehicle removed successfully!"
    });
  };

  const getVehicleIcon = (type: string) => {
    return type === 'car' ? <Car className="w-4 h-4" /> : <Bike className="w-4 h-4" />;
  };

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
              Manage Fleet
            </Button>
          </div>

          {/* Add Vehicle Tab */}
          {activeTab === "add" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleName">Vehicle Name</Label>
                  <Input
                    id="vehicleName"
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                    placeholder="e.g. Honda Activa"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select onValueChange={(value) => setNewVehicle({...newVehicle, type: value})}>
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
                  <Label htmlFor="vehiclePrice">Price per Day (₹)</Label>
                  <Input
                    id="vehiclePrice"
                    type="number"
                    value={newVehicle.price}
                    onChange={(e) => setNewVehicle({...newVehicle, price: e.target.value})}
                    placeholder="150"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleLocation">Location</Label>
                  <Input
                    id="vehicleLocation"
                    value={newVehicle.location}
                    onChange={(e) => setNewVehicle({...newVehicle, location: e.target.value})}
                    placeholder="e.g. MG Road, Bangalore"
                  />
                </div>
              </div>
              <Button onClick={handleAddVehicle} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          )}

          {/* Manage Fleet Tab */}
          {activeTab === "manage" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Total Vehicles: {vehicles.length}</p>
              <div className="grid gap-4">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getVehicleIcon(vehicle.type)}
                          <div>
                            <h4 className="font-semibold">{vehicle.name}</h4>
                            <p className="text-sm text-gray-600">{vehicle.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={vehicle.isAvailable ? "default" : "secondary"}>
                            {vehicle.isAvailable ? "Available" : "Booked"}
                          </Badge>
                          <span className="font-semibold">₹{vehicle.price}/day</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveVehicle(vehicle.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleManagementModal;
