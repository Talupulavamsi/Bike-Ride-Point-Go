
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Car, 
  Bike, 
  Settings, 
  MapPin, 
  Battery,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Wrench,
  Zap
} from "lucide-react";

const EnhancedFleetManagement = () => {
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [bulkPriceUpdate, setBulkPriceUpdate] = useState("");

  const vehicles = [
    {
      id: "1",
      name: "Hero Splendor Plus",
      type: "bike",
      status: "booked",
      location: "MG Road, Bangalore",
      battery: null,
      lastBooked: "2 hours ago",
      idleDays: 0,
      currentPrice: 150,
      totalEarnings: 6750,
      gpsEnabled: true,
      maintenanceStatus: "good",
      utilizationRate: 85
    },
    {
      id: "2",
      name: "Maruti Swift",
      type: "car",
      status: "idle",
      location: "Brigade Road, Bangalore",
      battery: null,
      lastBooked: "1 day ago",
      idleDays: 1,
      currentPrice: 800,
      totalEarnings: 25600,
      gpsEnabled: true,
      maintenanceStatus: "good",
      utilizationRate: 72
    },
    {
      id: "3",
      name: "Ather 450X",
      type: "scooter",
      status: "idle",
      location: "Commercial Street, Bangalore",
      battery: 85,
      lastBooked: "5 hours ago",
      idleDays: 0,
      currentPrice: 200,
      totalEarnings: 5600,
      gpsEnabled: true,
      maintenanceStatus: "good",
      utilizationRate: 78
    },
    {
      id: "4",
      name: "Honda Activa",
      type: "scooter",
      status: "maintenance",
      location: "Service Center",
      battery: null,
      lastBooked: "3 days ago",
      idleDays: 3,
      currentPrice: 180,
      totalEarnings: 3240,
      gpsEnabled: false,
      maintenanceStatus: "service",
      utilizationRate: 45
    },
    {
      id: "5",
      name: "TVS Apache",
      type: "bike",
      status: "idle",
      location: "Koramangala, Bangalore",
      battery: null,
      lastBooked: "8 days ago",
      idleDays: 8,
      currentPrice: 160,
      totalEarnings: 1920,
      gpsEnabled: true,
      maintenanceStatus: "alert",
      utilizationRate: 25
    }
  ];

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return <Bike className="w-4 h-4" />;
      case 'car': return <Car className="w-4 h-4" />;
      case 'scooter': return <Bike className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <Badge className="bg-rental-trust-green">Booked</Badge>;
      case 'idle':
        return <Badge variant="secondary">Idle</Badge>;
      case 'maintenance':
        return <Badge variant="destructive">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMaintenanceIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-rental-trust-green" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'service':
        return <Wrench className="w-4 h-4 text-red-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicles(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handleBulkPriceUpdate = () => {
    if (bulkPriceUpdate && selectedVehicles.length > 0) {
      console.log(`Updating price to ₹${bulkPriceUpdate} for vehicles:`, selectedVehicles);
      // Implementation would go here
    }
  };

  const alertVehicles = vehicles.filter(v => v.idleDays >= 5 || v.maintenanceStatus === 'alert');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-rental-navy-800">Fleet Management</h2>
          <p className="text-rental-navy-600">Advanced vehicle operations and monitoring</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
          <Button className="bg-rental-teal-500 hover:bg-rental-teal-600">
            <Car className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Fleet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rental-navy-500">Total Fleet</p>
                <p className="text-2xl font-bold text-rental-navy-800">{vehicles.length}</p>
              </div>
              <Car className="w-8 h-8 text-rental-teal-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rental-navy-500">Currently Booked</p>
                <p className="text-2xl font-bold text-rental-trust-green">
                  {vehicles.filter(v => v.status === 'booked').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-rental-trust-green" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rental-navy-500">Needs Attention</p>
                <p className="text-2xl font-bold text-yellow-600">{alertVehicles.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rental-navy-500">Avg Utilization</p>
                <p className="text-2xl font-bold text-rental-navy-800">
                  {Math.round(vehicles.reduce((sum, v) => sum + v.utilizationRate, 0) / vehicles.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-rental-lime-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedVehicles.length > 0 && (
        <Card className="border-rental-teal-200 bg-rental-teal-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-sm font-semibold text-rental-teal-700">
                  {selectedVehicles.length} vehicles selected
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="New price (₹)"
                    value={bulkPriceUpdate}
                    onChange={(e) => setBulkPriceUpdate(e.target.value)}
                    className="w-32"
                  />
                  <Button size="sm" onClick={handleBulkPriceUpdate}>
                    Update Price
                  </Button>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Toggle GPS</Button>
                <Button size="sm" variant="outline">Set Unavailable</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Status & Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Booked</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className={vehicle.idleDays >= 5 ? "bg-yellow-50" : ""}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(vehicle.id)}
                      onChange={() => handleVehicleSelection(vehicle.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getVehicleIcon(vehicle.type)}
                      <div>
                        <p className="font-medium">{vehicle.name}</p>
                        <div className="flex items-center space-x-1">
                          {getMaintenanceIcon(vehicle.maintenanceStatus)}
                          {vehicle.battery && (
                            <div className="flex items-center space-x-1">
                              <Battery className="w-3 h-3 text-rental-trust-green" />
                              <span className="text-xs">{vehicle.battery}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm">{vehicle.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm">{vehicle.lastBooked}</span>
                      {vehicle.idleDays >= 5 && (
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-rental-trust-green"
                          style={{ width: `${vehicle.utilizationRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{vehicle.utilizationRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span>₹{vehicle.currentPrice}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">₹{vehicle.totalEarnings.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        {vehicle.gpsEnabled ? (
                          <ToggleRight className="w-4 h-4 text-rental-trust-green" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alerts */}
      {alertVehicles.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-700">
              <AlertTriangle className="w-5 h-5" />
              <span>Vehicle Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getVehicleIcon(vehicle.type)}
                    <span className="font-medium">{vehicle.name}</span>
                    <span className="text-sm text-yellow-600">
                      {vehicle.idleDays >= 5 
                        ? `Idle for ${vehicle.idleDays} days` 
                        : 'Needs maintenance check'}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedFleetManagement;
