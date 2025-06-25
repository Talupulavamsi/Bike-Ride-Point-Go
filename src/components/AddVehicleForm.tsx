
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Car, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/contexts/FirebaseContext";
import { useAppStore } from "@/hooks/useAppStore";

const AddVehicleForm = () => {
  const { toast } = useToast();
  const { user, userProfile } = useFirebase();
  const { addVehicle } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [vehicleData, setVehicleData] = useState({
    vehicleName: "",
    vehicleType: "" as "bike" | "scooter" | "car" | "",
    price: "",
    location: "",
    description: "",
    image: ""
  });

  const handleSubmit = async () => {
    if (!user || !userProfile) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add a vehicle",
        variant: "destructive"
      });
      return;
    }

    if (!vehicleData.vehicleName || !vehicleData.vehicleType || !vehicleData.price || !vehicleData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Add vehicle with correct schema
      const vehicle = await addVehicle({
        name: vehicleData.vehicleName,
        type: vehicleData.vehicleType as "bike" | "scooter" | "car",
        price: parseInt(vehicleData.price),
        location: vehicleData.location,
        isAvailable: true,
        rating: 5.0,
        totalBookings: 0,
        totalEarnings: 0,
        lastBooked: 'Never',
        gpsStatus: 'active' as const,
        ownerId: user.uid,
        ownerName: userProfile.name,
        features: ['GPS Enabled', 'User Listed', 'Verified Vehicle'],
        image: vehicleData.image || '/placeholder.svg'
      });

      // Reset form
      setVehicleData({
        vehicleName: "",
        vehicleType: "",
        price: "",
        location: "",
        description: "",
        image: ""
      });

      toast({
        title: "🎉 Vehicle Listed Successfully!",
        description: `${vehicle.name} is now available for booking. You're automatically registered as an owner!`,
      });

    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Listing Failed",
        description: "Failed to list your vehicle. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Car className="w-5 h-5 text-rental-teal-500" />
          <span>List Your Vehicle</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Earn money by renting out your vehicle. You'll automatically become an owner!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vehicleName">Vehicle Name *</Label>
            <Input
              id="vehicleName"
              value={vehicleData.vehicleName}
              onChange={(e) => setVehicleData({...vehicleData, vehicleName: e.target.value})}
              placeholder="e.g. Honda Activa 6G, Maruti Swift"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="vehicleType">Vehicle Type *</Label>
            <Select 
              onValueChange={(value) => setVehicleData({...vehicleData, vehicleType: value as "bike" | "scooter" | "car"})}
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
              value={vehicleData.price}
              onChange={(e) => setVehicleData({...vehicleData, price: e.target.value})}
              placeholder="150"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="vehicleLocation">Location *</Label>
            <Input
              id="vehicleLocation"
              value={vehicleData.location}
              onChange={(e) => setVehicleData({...vehicleData, location: e.target.value})}
              placeholder="e.g. MG Road, Bangalore"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="vehicleDescription">Description (Optional)</Label>
          <Textarea
            id="vehicleDescription"
            value={vehicleData.description}
            onChange={(e) => setVehicleData({...vehicleData, description: e.target.value})}
            placeholder="Additional details about your vehicle..."
            disabled={isSubmitting}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="vehicleImage">Image URL (Optional)</Label>
          <Input
            id="vehicleImage"
            value={vehicleData.image}
            onChange={(e) => setVehicleData({...vehicleData, image: e.target.value})}
            placeholder="https://example.com/vehicle-image.jpg"
            disabled={isSubmitting}
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full bg-rental-teal-500 hover:bg-rental-teal-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Listing Vehicle...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              List My Vehicle
            </>
          )}
        </Button>

        <div className="bg-rental-teal-50 p-4 rounded-lg">
          <h4 className="font-semibold text-rental-teal-800 mb-2">What happens next?</h4>
          <ul className="text-sm text-rental-teal-700 space-y-1">
            <li>• Your vehicle becomes available for booking</li>
            <li>• You're automatically registered as an owner</li>
            <li>• Access the Owner Dashboard to manage bookings</li>
            <li>• Earn money when users book your vehicle</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddVehicleForm;
