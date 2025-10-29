
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationSystem from "./NotificationSystem";
import { useFirebase } from '@/contexts/FirebaseContext';
import ProfileSettings from "@/components/ProfileSettings";

interface DashboardHeaderProps {
  userRole: 'owner' | 'user';
}

const DashboardHeader = ({ userRole }: DashboardHeaderProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile, logout } = useFirebase();

  const userId = user?.uid || '';
  const userName = userProfile?.name || (userRole === 'owner' ? 'Owner' : 'Rider');

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-gradient-to-r from-rental-teal-500 to-rental-lime-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">RidePoint</h1>
                <p className="text-xs text-white/90 capitalize">
                  {userRole} Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/')}
              className="text-white hover:bg-white/20"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>

            <NotificationSystem userRole={userRole} userId={userId} />

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right cursor-pointer" onClick={() => setShowProfile(true)}>
                <p className="text-sm font-medium text-white">{userName}</p>
                <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/30">
                  {userRole === 'owner' ? 'Vehicle Owner' : 'Rider'}
                </Badge>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer" onClick={() => setShowProfile(true)}>
                <User className="w-4 h-4 text-white" />
              </div>
            </div>

            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Settings className="w-4 h-4" />
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={async () => { await logout(); handleNavigation('/'); }}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="w-8 h-8 bg-rental-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-rental-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-rental-navy-800">{userName}</p>
                  <Badge variant="outline" className="text-xs">
                    {userRole === 'owner' ? 'Vehicle Owner' : 'Rider'}
                  </Badge>
                </div>
              </div>
              
              <div className="px-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">Notifications</span>
                <NotificationSystem userRole={userRole} userId={userId} />
              </div>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>

              <Button variant="ghost" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={async () => { await logout(); handleNavigation('/'); }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowProfile(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-rental-teal-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-rental-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="text-base font-semibold text-gray-900">{userName}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowProfile(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6">
                <ProfileSettings userRole={userRole === 'owner' ? 'owner' : 'renter'} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
