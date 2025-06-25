
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Bike } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'owner' | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'user' | 'owner') => {
    setSelectedRole(role);
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    if (selectedRole === 'owner') {
      navigate('/owner-dashboard');
    } else {
      navigate('/renter-dashboard');
    }
  };

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
                <p className="text-sm text-rental-navy-500">AI-Powered Vehicle Sharing</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-rental-trust-green/10 text-rental-trust-green border-rental-trust-green/20">
              🤖 AI Enhanced
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-rental-navy-800 mb-4 leading-tight">
              Next-Gen Vehicle Sharing
              <br />
              <span className="text-rental-teal-500">Made Intelligent</span>
            </h2>
            <p className="text-xl text-rental-navy-600 max-w-2xl mx-auto">
              AI-powered recommendations, real-time GPS tracking, voice search, and secure identity verification
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-rental-teal-500/20 bg-white/80 backdrop-blur-sm"
              onClick={() => handleRoleSelection('user')}
            >
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-rental-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-rental-navy-800">I Want to Rent</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-rental-navy-600 mb-6">
                  AI-powered vehicle discovery with voice search, live GPS tracking, and smart recommendations
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="bg-rental-teal-50 p-3 rounded-lg">
                    <div className="font-semibold text-rental-teal-700">🎙️ Voice Search</div>
                    <div className="text-rental-navy-600">Speak your needs</div>
                  </div>
                  <div className="bg-rental-teal-50 p-3 rounded-lg">
                    <div className="font-semibold text-rental-teal-700">🤖 AI Suggestions</div>
                    <div className="text-rental-navy-600">Smart recommendations</div>
                  </div>
                  <div className="bg-rental-teal-50 p-3 rounded-lg">
                    <div className="font-semibold text-rental-teal-700">📍 Live Tracking</div>
                    <div className="text-rental-navy-600">Real-time GPS</div>
                  </div>
                  <div className="bg-rental-teal-50 p-3 rounded-lg">
                    <div className="font-semibold text-rental-teal-700">💬 In-App Chat</div>
                    <div className="text-rental-navy-600">Direct owner contact</div>
                  </div>
                </div>
                <Button className="w-full bg-rental-teal-500 hover:bg-rental-teal-600 text-white">
                  Start Renting with AI
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
                  AI-driven pricing, demand analytics, and automated booking management for maximum earnings
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="bg-rental-lime-50 p-3 rounded-lg">
                    <div className="font-semibold text-rental-lime-700">🧠 Smart Pricing</div>
                    <div className="text-rental-navy-600">AI price optimization</div>
                  </div>
                  <div className="bg-rental-lime-50 p-3 rounded-lg">
                    <div className="font-semibold text-rental-lime-700">📊 Analytics</div>
                    <div className="text-rental-navy-600">Earnings insights</div>
                  </div>
                  <div className="bg-rental-lime-50 p-3 rounded-lg">
                    <div className="font-semibold text-rental-lime-700">🔒 Auto Accept</div>
                    <div className="text-rental-navy-600">Verified renters only</div>
                  </div>
                  <div className="bg-rental-lime-50 p-3 rounded-lg">
                    <div className="font-semibold text-rental-lime-700">🌡️ Demand Meter</div>
                    <div className="text-rental-navy-600">Real-time insights</div>
                  </div>
                </div>
                <Button className="w-full bg-rental-lime-500 hover:bg-rental-lime-600 text-white">
                  Start Earning with AI
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* AI Features Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-rental-trust-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">🤖</div>
              </div>
              <h3 className="font-semibold text-rental-navy-800 mb-2">AI Intelligence</h3>
              <p className="text-sm text-rental-navy-600">Smart pricing, recommendations, and demand prediction powered by machine learning</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rental-trust-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-rental-trust-blue" />
              </div>
              <h3 className="font-semibold text-rental-navy-800 mb-2">Live GPS Tracking</h3>
              <p className="text-sm text-rental-navy-600">Real-time location updates, route optimization, and arrival predictions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rental-trust-yellow/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">🛡️</div>
              </div>
              <h3 className="font-semibold text-rental-navy-800 mb-2">Secure & Verified</h3>
              <p className="text-sm text-rental-navy-600">Aadhaar verification, document validation, and community trust scores</p>
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
