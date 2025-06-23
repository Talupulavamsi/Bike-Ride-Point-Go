
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  User, 
  Bell, 
  MessageSquare, 
  Plus,
  Eye,
  ToggleLeft,
  BarChart3,
  Calendar,
  Clock
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import VehicleManagement from "@/components/VehicleManagement";
import BookingManagement from "@/components/BookingManagement";
import EarningsAnalytics from "@/components/EarningsAnalytics";
import ProfileSettings from "@/components/ProfileSettings";
import RevenueForecastingModule from "@/components/RevenueForecastingModule";
import SeasonalDemandHeatmaps from "@/components/SeasonalDemandHeatmaps";
import EnhancedFleetManagement from "@/components/EnhancedFleetManagement";
import EnhancedAnalytics from "@/components/EnhancedAnalytics";
import VehicleManagementModal from "@/components/VehicleManagementModal";
import { useVehicleStore } from "@/hooks/useVehicleStore";

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats, bookings, addBooking } = useVehicleStore();

  // Simulate some demo bookings for demonstration
  useEffect(() => {
    if (bookings.length === 0 && stats.totalVehicles > 0) {
      // Add demo bookings only if there are vehicles but no bookings
      const demoBookings = [
        {
          renterId: "renter-1",
          renterName: "Amit Kumar",
          vehicleId: "1",
          vehicleName: "Hero Splendor Plus",
          pickupTime: "Today, 9:30 AM",
          duration: "2 hours",
          amount: "₹300",
          status: "active" as const,
          startTime: "09:30 AM"
        },
        {
          renterId: "renter-2",
          renterName: "Priya Singh",
          vehicleId: "2",
          vehicleName: "Maruti Swift",
          pickupTime: "Today, 2:00 PM",
          duration: "1 day",
          amount: "₹800",
          status: "upcoming" as const,
          startTime: "02:00 PM"
        }
      ];

      // Add demo bookings after a short delay
      setTimeout(() => {
        demoBookings.forEach(booking => addBooking(booking));
      }, 1000);
    }
  }, [stats.totalVehicles, bookings.length, addBooking]);

  const dashboardStats = [
    {
      title: "Total Earnings",
      value: `₹${stats.totalEarnings.toLocaleString()}`,
      change: "+12%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-rental-trust-green"
    },
    {
      title: "Active Vehicles",
      value: stats.totalVehicles.toString(),
      change: `${stats.availableVehicles} available`,
      changeType: "neutral" as const,
      icon: Car,
      color: "text-rental-teal-500"
    },
    {
      title: "Bookings Today",
      value: stats.activeBookings.toString(),
      change: "+25%",
      changeType: "positive" as const,
      icon: Calendar,
      color: "text-rental-lime-500"
    },
    {
      title: "Avg Rating",
      value: stats.averageRating,
      change: "⭐⭐⭐⭐⭐",
      changeType: "neutral" as const,
      icon: TrendingUp,
      color: "text-rental-trust-yellow"
    }
  ];

  const recentBookings = bookings.slice(0, 3);

  const getChangeColor = (changeType: "positive" | "negative" | "neutral") => {
    if (changeType === "positive") {
      return "text-rental-trust-green";
    } else if (changeType === "negative") {
      return "text-red-500";
    } else {
      return "text-rental-navy-500";
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "bookings":
        setActiveTab("bookings");
        break;
      case "analytics":
        setActiveTab("analytics");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userRole="owner" />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-rental-navy-800">Owner Dashboard</h1>
          <p className="text-rental-navy-600 mt-2">Manage your fleet and maximize earnings with AI insights</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
            <TabsTrigger value="heatmaps">Demand Maps</TabsTrigger>
            <TabsTrigger value="vehicles">Fleet</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-rental-navy-500">{stat.title}</p>
                        <p className="text-2xl font-bold text-rental-navy-800">{stat.value}</p>
                        <p className={`text-sm ${getChangeColor(stat.changeType)}`}>
                          {stat.change}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <VehicleManagementModal
                    trigger={
                      <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-rental-teal-500 hover:bg-rental-teal-600 w-full">
                        <Plus className="w-6 h-6" />
                        <span>Add Vehicle</span>
                      </Button>
                    }
                  />
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => handleQuickAction("bookings")}
                  >
                    <Eye className="w-6 h-6" />
                    <span>View Bookings</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => handleQuickAction("analytics")}
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No current bookings</h3>
                    <p className="text-gray-600">
                      Your booking history will appear here when customers book your vehicles.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-rental-teal-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-rental-teal-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-rental-navy-800">{booking.renterName}</p>
                            <p className="text-sm text-rental-navy-500">{booking.vehicleName}</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-rental-navy-800">{booking.amount}</p>
                          <p className="text-sm text-rental-navy-500">{booking.duration}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            booking.status === 'active' ? 'default' : 
                            booking.status === 'upcoming' ? 'secondary' : 'outline'
                          }>
                            {booking.status}
                          </Badge>
                          <p className="text-sm text-rental-navy-500 mt-1">{booking.startTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting">
            <RevenueForecastingModule />
          </TabsContent>

          <TabsContent value="heatmaps">
            <SeasonalDemandHeatmaps />
          </TabsContent>

          <TabsContent value="vehicles">
            <EnhancedFleetManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <EnhancedAnalytics />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings userRole="owner" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboard;
