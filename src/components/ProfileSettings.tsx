
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Shield, FileText, Camera, Edit } from "lucide-react";

interface ProfileSettingsProps {
  userRole: 'owner' | 'renter';
}

const ProfileSettings = ({ userRole }: ProfileSettingsProps) => {
  const userInfo = {
    name: userRole === 'owner' ? 'Rajesh Kumar' : 'Amit Patel',
    email: userRole === 'owner' ? 'rajesh@example.com' : 'amit@example.com',
    phone: '+91 9876543210',
    rating: userRole === 'owner' ? 4.8 : 4.9,
    joinDate: 'March 2023',
    verificationStatus: 'verified'
  };

  const documents = [
    {
      type: 'Aadhaar Card',
      status: 'verified',
      uploadDate: '15 Mar 2023'
    },
    {
      type: 'Driving License',
      status: 'verified', 
      uploadDate: '15 Mar 2023'
    },
    {
      type: 'Address Proof',
      status: 'verified',
      uploadDate: '15 Mar 2023'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-rental-navy-800">Profile Settings</h2>
        <p className="text-rental-navy-600">Manage your account and verification documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-rental-navy-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-rental-navy-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-rental-navy-800">{userInfo.name}</h3>
                <p className="text-sm text-rental-navy-500">{userRole === 'owner' ? 'Vehicle Owner' : 'Verified Renter'}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="bg-rental-trust-green/10 text-rental-trust-green">
                    ⭐ {userInfo.rating} Rating
                  </Badge>
                  <Badge variant="outline">
                    Joined {userInfo.joinDate}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-1" />
                Change Photo
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-rental-navy-600">Full Name</label>
                <Input value={userInfo.name} className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-rental-navy-600">Email</label>
                <Input value={userInfo.email} className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-rental-navy-600">Phone Number</label>
                <Input value={userInfo.phone} className="mt-1" />
              </div>
            </div>

            <Button className="w-full bg-rental-teal-500 hover:bg-rental-teal-600">
              <Edit className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Document Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Document Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-rental-trust-green/10 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-rental-trust-green rounded-full"></div>
                <span className="text-sm font-semibold text-rental-trust-green">Fully Verified Account</span>
              </div>
              <p className="text-xs text-rental-navy-600 mt-1">All documents verified successfully</p>
            </div>

            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-rental-navy-400" />
                    <div>
                      <p className="text-sm font-medium text-rental-navy-800">{doc.type}</p>
                      <p className="text-xs text-rental-navy-500">Uploaded {doc.uploadDate}</p>
                    </div>
                  </div>
                  <Badge className="bg-rental-trust-green text-white">
                    Verified
                  </Badge>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Upload Additional Documents
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline">
              Change Password
            </Button>
            <Button variant="outline">
              Privacy Settings
            </Button>
            <Button variant="outline">
              Notification Preferences
            </Button>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
