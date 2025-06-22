
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MapPin, MessageSquare, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  userRole: 'owner' | 'renter';
}

const DashboardHeader = ({ userRole }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-rental-teal-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-rental-navy-800">RidePoint</h1>
              <p className="text-xs text-rental-navy-500">
                {userRole === 'owner' ? 'Owner Portal' : 'Renter Portal'}
              </p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>

            {/* Messages */}
            <Button variant="ghost" size="sm" className="relative">
              <MessageSquare className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-rental-teal-500 text-white text-xs">
                2
              </Badge>
            </Button>

            {/* Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-rental-navy-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-rental-navy-600" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-rental-navy-800">
                  {userRole === 'owner' ? 'Rajesh Kumar' : 'Amit Patel'}
                </p>
                <p className="text-xs text-rental-navy-500">
                  {userRole === 'owner' ? 'Vehicle Owner' : 'Verified Renter'}
                </p>
              </div>
            </div>

            {/* Logout */}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
