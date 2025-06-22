
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Search, 
  Mic, 
  Car, 
  Clock, 
  Star, 
  Filter, 
  Navigation,
  User,
  Settings,
  Heart,
  MessageSquare,
  Smartphone
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import VehicleDiscovery from "@/components/VehicleDiscovery";
import BookingHistory from "@/components/BookingHistory";
import ProfileSettings from "@/components/ProfileSettings";
import SmartRecommendations from "@/components/SmartRecommendations";

const RenterDashboard = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);

  const quickStats = [
    {
      title: "Total Rides",
      value: "24",
      subtitle: "This month",
      icon: Car,
      color: "text-rental-teal-500"
    },
    {
      title: "Money Saved",
      value: "₹3,200",
      subtitle: "vs owning",
      icon: Star,
      color: "text-rental-trust-green"
    },
    {
      title: "CO₂ Reduced",
      value: "45kg",
      subtitle: "Environmental impact",
      icon: MapPin,
      color: "text-rental-lime-500"
    },
    {
      title: "Avg Rating",
      value: "4.9",
      subtitle: "Your rider score",
      icon: Star,
      color: "text-rental-trust-yellow"
    }
  ];

  const recentBookings = [
    {
      id: "1",
      vehicle: "Hero Splendor Plus",
      owner: "Rajesh Kumar",
      date: "Today, 2:30 PM",
      status: "active",
      location: "MG Road, Bangalore",
      price: "₹150"
    },
    {
      id: "2", 
      vehicle: "Ather 450X",
      owner: "Amit Patel",
      date: "Yesterday",
      status: "completed",
      location: "Commercial Street",
      price: "₹200"
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
      <DashboardHeader userRole="renter" />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-rental-navy-800">Discover & Book</h1>
          <p className="text-rental-navy-600 mt-2">AI-powered vehicle discovery with smart recommendations</p>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-rental-navy-500">{stat.title}</p>
                        <p className="text-2xl font-bold text-rental-navy-800">{stat.value}</p>
                        <p className="text-sm text-rental-navy-500">{stat.subtitle}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Smart Recommendations */}
            <SmartRecommendations />

            {/* Vehicle Discovery */}
            <VehicleDiscovery />

            {/* Current Active Booking */}
            {recentBookings.some(b => b.status === 'active') && (
              <Card className="border-rental-teal-200 bg-rental-teal-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-rental-teal-700">
                    <Navigation className="w-5 h-5" />
                    <span>Active Booking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-rental-teal-200 rounded-full flex items-center justify-center">
                        <Car className="w-6 h-6 text-rental-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-rental-navy-800">Hero Splendor Plus</p>
                        <p className="text-sm text-rental-navy-600">Owner: Rajesh Kumar</p>
                        <p className="text-sm text-rental-navy-500">📍 MG Road, Bangalore</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-rental-trust-green text-white mb-2">Active</Badge>
                      <p className="text-sm text-rental-navy-600">₹150/day</p>
                      <Button size="sm" className="mt-2 bg-rental-teal-500 hover:bg-rental-teal-600">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            <BookingHistory />
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Favorite Vehicles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-rental-navy-500 text-center py-8">No favorite vehicles yet. Start exploring to save your preferred rides!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings userRole="renter" />
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Help & Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <MessageSquare className="w-6 h-6" />
                    <span>Live Chat</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Smartphone className="w-6 h-6" />
                    <span>Call Support</span>
                  </Button>
                </div>
                <div className="bg-rental-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-rental-navy-800 mb-2">Frequently Asked Questions</h3>
                  <div className="space-y-2 text-sm text-rental-navy-600">
                    <p>• How do I verify my documents?</p>
                    <p>• What happens if I return the vehicle late?</p>
                    <p>• How does GPS tracking work?</p>
                    <p>• Can I extend my booking?</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RenterDashboard;
