
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Bike } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import MapInterface from "@/components/MapInterface";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'renter' | 'owner' | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleRoleSelection = (role: 'renter' | 'owner') => {
    setSelectedRole(role);
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  if (isAuthenticated) {
    return <MapInterface userRole={selectedRole} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rental-navy-50 via-white to-rental-teal-50">
      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rental-teal-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-rental-navy-800">RidePoint</h1>
                <p className="text-sm text-rental-navy-500">Location-First Vehicle Sharing</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-rental-trust-green/10 text-rental-trust-green border-rental-trust-green/20">
              🔐 Secure & Verified
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-rental-navy-800 mb-4 leading-tight">
              Smart Vehicle Sharing
              <br />
              <span className="text-rental-teal-500">Made Simple</span>
            </h2>
            <p className="text-xl text-rental-navy-600 max-w-2xl mx-auto">
              Real-time GPS tracking, secure identity verification, and seamless booking experience
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-rental-teal-500/20 bg-white/80 backdrop-blur-sm"
              onClick={() => handleRoleSelection('renter')}
            >
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-rental-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-rental-navy-800">I Want to Rent</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-rental-navy-600 mb-6">
                  Find and book bikes, cars, and scooters near you with real-time GPS tracking
                </p>
                <div className="flex justify-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Bike className="w-5 h-5 text-rental-teal-500" />
                    <span className="text-sm text-rental-navy-600">Bikes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="w-5 h-5 text-rental-teal-500" />
                    <span className="text-sm text-rental-navy-600">Cars</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bike className="w-5 h-5 text-rental-teal-500" />
                    <span className="text-sm text-rental-navy-600">Scooters</span>
                  </div>
                </div>
                <Button className="w-full bg-rental-teal-500 hover:bg-rental-teal-600 text-white">
                  Start Renting
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-rental-lime-500/20 bg-white/80 backdrop-blur-sm"
              onClick={() => handleRoleSelection('owner')}
            >
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-rental-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-rental-navy-800">I Want to List</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-rental-navy-600 mb-6">
                  List your vehicles and earn money with GPS tracking and verified renters
                </p>
                <div className="flex justify-center space-x-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rental-lime-500">₹500+</div>
                    <div className="text-xs text-rental-navy-500">Daily Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rental-lime-500">24/7</div>
                    <div className="text-xs text-rental-navy-500">GPS Tracking</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rental-lime-500">100%</div>
                    <div className="text-xs text-rental-navy-500">Verified Users</div>
                  </div>
                </div>
                <Button className="w-full bg-rental-lime-500 hover:bg-rental-lime-600 text-white">
                  Start Earning
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-rental-trust-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-rental-trust-green rounded-full"></div>
              </div>
              <h3 className="font-semibold text-rental-navy-800 mb-2">Identity Verified</h3>
              <p className="text-sm text-rental-navy-600">Aadhaar & license verification required</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-rental-trust-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-rental-trust-blue" />
              </div>
              <h3 className="font-semibold text-rental-navy-800 mb-2">Real-time Tracking</h3>
              <p className="text-sm text-rental-navy-600">Live GPS location updates</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-rental-trust-yellow/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-rental-trust-yellow rounded-full"></div>
              </div>
              <h3 className="font-semibold text-rental-navy-800 mb-2">Secure Payments</h3>
              <p className="text-sm text-rental-navy-600">Protected transactions & deposits</p>
            </div>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          role={selectedRole}
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default Index;
