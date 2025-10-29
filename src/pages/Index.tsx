
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car } from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-rental-teal-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-rental-lime-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.8s' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-rental-navy-50 via-white to-rental-teal-50" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rental-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-rental-teal-500/30">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-rental-navy-900">RidePoint</h1>
                <p className="text-sm text-rental-navy-600">AI-Powered Vehicle Sharing</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-white/60 backdrop-blur border-white/30 text-rental-navy-700">
              🚀 Next-Gen
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center pt-6 md:pt-10">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-rental-navy-900 leading-tight">
              Find it. Book it. <span className="text-rental-teal-600">Ride it.</span>
            </h2>
            <p className="mt-4 text-lg md:text-xl text-rental-navy-600 max-w-3xl mx-auto">
              Real-time vehicles, secure identity, and smart tools for renters and owners.
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-xl"
              onClick={() => handleRoleSelection('user')}
            >
              <CardHeader className="pb-2">
                <div className="w-16 h-16 bg-rental-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-rental-teal-500/30">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-rental-navy-900">I Want to Rent</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-rental-navy-600 mb-6">
                  Discover available vehicles with live availability and transparent pricing.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                  <div className="bg-rental-teal-50 p-3 rounded-lg border border-rental-teal-100">📍 Live Tracking</div>
                  <div className="bg-rental-teal-50 p-3 rounded-lg border border-rental-teal-100">🔐 Verified IDs</div>
                  <div className="bg-rental-teal-50 p-3 rounded-lg border border-rental-teal-100">💳 Easy Payments</div>
                  <div className="bg-rental-teal-50 p-3 rounded-lg border border-rental-teal-100">🧾 Clear Pricing</div>
                </div>
                <Button className="w-full bg-rental-teal-600 hover:bg-rental-teal-700 text-white">
                  Start Renting
                </Button>
              </CardContent>
            </Card>

            <Card
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-xl"
              onClick={() => handleRoleSelection('owner')}
            >
              <CardHeader className="pb-2">
                <div className="w-16 h-16 bg-rental-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-rental-lime-500/30">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-rental-navy-900">I Want to List</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-rental-navy-600 mb-6">
                  List your vehicle with safety, analytics, and automated booking workflows.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                  <div className="bg-rental-lime-50 p-3 rounded-lg border border-rental-lime-100">🧠 Smart Pricing</div>
                  <div className="bg-rental-lime-50 p-3 rounded-lg border border-rental-lime-100">📊 Earnings Insights</div>
                  <div className="bg-rental-lime-50 p-3 rounded-lg border border-rental-lime-100">⚙️ Auto Management</div>
                  <div className="bg-rental-lime-50 p-3 rounded-lg border border-rental-lime-100">✅ Verified Renters</div>
                </div>
                <Button className="w-full bg-rental-lime-600 hover:bg-rental-lime-700 text-white">
                  Start Earning
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/70 backdrop-blur border border-white/50 shadow">
              <div className="text-2xl mb-2">⏱️</div>
              <h3 className="font-semibold text-rental-navy-900 mb-1">Instant</h3>
              <p className="text-sm text-rental-navy-600">Real-time availability and instant bookings.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/70 backdrop-blur border border-white/50 shadow">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-rental-navy-900 mb-1">Secure</h3>
              <p className="text-sm text-rental-navy-600">Verified profiles, protected data, and safe payments.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/70 backdrop-blur border border-white/50 shadow">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="font-semibold text-rental-navy-900 mb-1">Smart</h3>
              <p className="text-sm text-rental-navy-600">Helpful insights for both renters and owners.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center text-sm text-rental-navy-500">
            © {new Date().getFullYear()} RidePoint • Built with ❤
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
