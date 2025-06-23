
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Car, 
  Shield,
  Bell,
  CreditCard,
  Settings,
  Lock
} from "lucide-react";
import VehicleOwnerProfile from "./VehicleOwnerProfile";
import { useVehicleStore } from "@/hooks/useVehicleStore";

interface ProfileSettingsProps {
  userRole: 'renter' | 'owner' | null;
}

const ProfileSettings = ({ userRole }: ProfileSettingsProps) => {
  const { owner, stats } = useVehicleStore();
  
  const [profileData, setProfileData] = useState({
    name: owner?.name || 'Rajesh Kumar',
    email: owner?.email || 'rajesh.kumar@email.com',
    phone: owner?.phone || '+91 98765 43210',
    location: owner?.location || 'Bangalore, Karnataka',
    joinDate: owner?.joinDate || 'January 2024',
    verified: owner?.verified || true,
    aadhaar: owner?.aadhaar || '****-****-1234',
    license: owner?.license || 'KA02-****-5678'
  });

  const userStats = userRole === 'owner' 
    ? {
        totalVehicles: stats.totalVehicles,
        totalEarnings: `₹${stats.totalEarnings.toLocaleString()}`,
        totalRides: stats.totalBookings,
        rating: stats.averageRating
      }
    : {
        totalRides: 24,
        totalSpent: '₹3,200',
        savedMoney: '₹8,500',
        rating: 4.9
      };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-xl">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                {profileData.verified && (
                  <Badge className="bg-rental-trust-green text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant="outline" className="capitalize">
                  {userRole}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {userRole === 'owner' ? (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rental-navy-800">{userStats.totalVehicles}</p>
                      <p className="text-sm text-rental-navy-600">Vehicles Listed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rental-trust-green">{userStats.totalEarnings}</p>
                      <p className="text-sm text-rental-navy-600">Total Earnings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rental-teal-600">{userStats.totalRides}</p>
                      <p className="text-sm text-rental-navy-600">Total Bookings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rental-trust-yellow">{userStats.rating}</p>
                      <p className="text-sm text-rental-navy-600">Rating</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rental-teal-600">{userStats.totalRides}</p>
                      <p className="text-sm text-rental-navy-600">Total Rides</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rental-trust-green">{userStats.totalSpent}</p>
                      <p className="text-sm text-rental-navy-600">Total Spent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rental-lime-600">{userStats.savedMoney}</p>
                      <p className="text-sm text-rental-navy-600">Money Saved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rental-trust-yellow">{userStats.rating}</p>
                      <p className="text-sm text-rental-navy-600">Your Rating</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          {userRole === 'owner' && <TabsTrigger value="vehicles">My Fleet</TabsTrigger>}
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      readOnly
                      className="bg-gray-50"
                    />
                    <Lock className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      value={profileData.phone}
                      readOnly
                      className="bg-gray-50"
                    />
                    <Lock className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  />
                </div>
                {userRole === 'owner' && (
                  <>
                    <div>
                      <Label htmlFor="aadhaar">Aadhaar Number</Label>
                      <div className="relative">
                        <Input
                          id="aadhaar"
                          value={profileData.aadhaar}
                          readOnly
                          className="bg-gray-50"
                        />
                        <Lock className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="license">Driving License</Label>
                      <div className="relative">
                        <Input
                          id="license"
                          value={profileData.license}
                          readOnly
                          className="bg-gray-50"
                        />
                        <Lock className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Button className="bg-rental-teal-500 hover:bg-rental-teal-600">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-rental-navy-500" />
                    <div>
                      <p className="font-medium">Member since</p>
                      <p className="text-sm text-rental-navy-600">{profileData.joinDate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-rental-trust-green" />
                    <div>
                      <p className="font-medium">Verification Status</p>
                      <p className="text-sm text-rental-trust-green">Verified Account</p>
                    </div>
                  </div>
                  <Badge className="bg-rental-trust-green">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                {userRole === 'owner' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Car className="w-5 h-5 text-rental-teal-600" />
                      <div>
                        <p className="font-medium">Total Vehicles Listed</p>
                        <p className="text-sm text-rental-teal-600">{stats.totalVehicles} vehicles in your fleet</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {stats.totalVehicles}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {userRole === 'owner' && (
          <TabsContent value="vehicles">
            <VehicleOwnerProfile />
          </TabsContent>
        )}

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Booking Updates</p>
                    <p className="text-sm text-rental-navy-600">Get notified about booking confirmations and updates</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Notifications</p>
                    <p className="text-sm text-rental-navy-600">Receive payment confirmations and receipts</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promotional Offers</p>
                    <p className="text-sm text-rental-navy-600">Get updates about discounts and special offers</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Methods
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Privacy & Security
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                App Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
