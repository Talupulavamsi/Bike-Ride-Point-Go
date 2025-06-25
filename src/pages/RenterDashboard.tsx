import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Search, 
  Mic, 
  Car, 
  Clock, 
  Star, 
  Filter
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import BookingHistory from "@/components/BookingHistory";
import ProfileSettings from "@/components/ProfileSettings";
import BookingInterface from "@/components/BookingInterface";
import { useRenterStore } from "@/hooks/useRenterStore";

const RenterDashboard = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  
  const { renter, stats } = useRenterStore();

  const quickStats = [
    {
      title: "Total Rides",
      value: stats.totalBookings.toString(),
      subtitle: "All time",
      icon: Car,
      color: "text-rental-teal-500"
    },
    {
      title: "Money Spent",
      value: `₹${stats.totalSpent.toLocaleString()}`,
      subtitle: "Total expenses",
      icon: Star,
      color: "text-rental-trust-green"
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings.toString(),
      subtitle: "Current rides",
      icon: Clock,
      color: "text-rental-lime-500"
    },
    {
      title: "Avg Rating",
      value: stats.averageRating.toFixed(1),
      subtitle: "Your rider score",
      icon: Star,
      color: "text-rental-trust-yellow"
    }
  ];

  const handleVoiceSearch = () => {
    setIsVoiceSearch(true);
    // Voice search simulation
    setTimeout(() => {
      setSearchQuery("Find electric scooter near me");
      setIsVoiceSearch(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userRole="user" />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-rental-navy-800">
            Welcome back, {renter?.name || 'Rider'}!
          </h1>
          <p className="text-rental-navy-600 mt-2">Discover vehicles and manage your bookings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Smart Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-rental-navy-400" />
                <Input
                  placeholder="Search vehicles, locations, or speak your needs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-16 h-12 text-lg"
                />
                <Button
                  onClick={handleVoiceSearch}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                    isVoiceSearch ? 'bg-red-500 animate-pulse' : 'bg-rental-teal-500'
                  }`}
                  disabled={isVoiceSearch}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" className="h-12">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
            {isVoiceSearch && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 text-rental-teal-600">
                  <div className="w-2 h-2 bg-rental-teal-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-rental-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-rental-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="ml-2">Listening...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discover">Discover & Book</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <BookingInterface />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingInterface />
          </TabsContent>

          <TabsContent value="history">
            <BookingHistory />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings userRole="renter" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RenterDashboard;
