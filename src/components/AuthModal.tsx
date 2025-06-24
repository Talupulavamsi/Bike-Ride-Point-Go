import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, AlertCircle, MapPin, Car } from "lucide-react";
import { useFirebase } from "@/contexts/FirebaseContext";

interface AuthModalProps {
  role: 'user' | 'owner' | null;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthStep = 'login' | 'signup' | 'kyc' | 'kyc-upload' | 'verification';

const AuthModal = ({ role, onClose, onSuccess }: AuthModalProps) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [isLogin, setIsLogin] = useState(true);
  const [kycProgress, setKycProgress] = useState(0);
  const [uploadedDocs, setUploadedDocs] = useState({
    aadhaar: false,
    license: false,
    address: false
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, updateProfile } = useFirebase();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      onSuccess();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!role) return;
    
    setLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: role,
        kycCompleted: false
      });

      // Only proceed to KYC for users (renters)
      if (role === 'user') {
        setCurrentStep('kyc');
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKycStart = () => {
    setCurrentStep('kyc-upload');
    setKycProgress(33);
  };

  const handleDocUpload = async (docType: keyof typeof uploadedDocs) => {
    setUploadedDocs(prev => ({ ...prev, [docType]: true }));
    const newProgress = Object.values({ ...uploadedDocs, [docType]: true }).filter(Boolean).length * 33;
    setKycProgress(newProgress);
    
    if (newProgress === 99) {
      setTimeout(async () => {
        setKycProgress(100);
        setCurrentStep('verification');
        
        // Update KYC status in Firebase
        await updateProfile({
          kycCompleted: true
        });
        
        setTimeout(() => onSuccess(), 2000);
      }, 1000);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              role === 'user' ? 'bg-rental-teal-500' : 'bg-rental-lime-500'
            }`}>
              {role === 'user' ? 
                <MapPin className="w-5 h-5 text-white" /> : 
                <Car className="w-5 h-5 text-white" />
              }
            </div>
            <DialogTitle>
              {role === 'user' ? 'Join as Renter' : 'Join as Owner'}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Login/Signup Form */}
        {(currentStep === 'login' || currentStep === 'signup') && (
          <div className="space-y-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={isLogin ? "default" : "ghost"}
                className="flex-1"
                onClick={() => {
                  setIsLogin(true);
                  setCurrentStep('login');
                }}
              >
                Login
              </Button>
              <Button
                variant={!isLogin ? "default" : "ghost"}
                className="flex-1"
                onClick={() => {
                  setIsLogin(false);
                  setCurrentStep('signup');
                }}
              >
                Sign Up
              </Button>
            </div>

            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
              {!isLogin && (
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={isLogin ? handleLogin : handleSignup}
              disabled={loading}
              className={`w-full ${
                role === 'user' 
                  ? 'bg-rental-teal-500 hover:bg-rental-teal-600' 
                  : 'bg-rental-lime-500 hover:bg-rental-lime-600'
              }`}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </Button>
          </div>
        )}

        {/* KYC Introduction - Only for users during signup */}
        {currentStep === 'kyc' && (
          <div className="space-y-6">
            <Card className="bg-rental-teal-50 border-rental-teal-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-rental-trust-yellow" />
                  <span>Identity Verification Required</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-rental-navy-600 mb-4">
                  For your safety and security, we need to verify your identity before you can rent vehicles.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-rental-trust-green" />
                    <span className="text-sm">Aadhaar Card (Government ID)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-rental-trust-green" />
                    <span className="text-sm">Driving License</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-rental-trust-green" />
                    <span className="text-sm">Address Proof</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Badge className="w-full justify-center py-2 bg-rental-trust-green/10 text-rental-trust-green">
              🔒 Your data is encrypted and secure
            </Badge>

            <Button 
              onClick={handleKycStart}
              className="w-full bg-rental-teal-500 hover:bg-rental-teal-600"
            >
              Start Verification
            </Button>
          </div>
        )}

        {/* KYC Upload */}
        {currentStep === 'kyc-upload' && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Verification Progress</span>
                <span className="text-sm text-rental-navy-600">{kycProgress}%</span>
              </div>
              <Progress value={kycProgress} className="h-2" />
            </div>

            <div className="space-y-4">
              {/* Aadhaar Upload */}
              <Card className={`border-2 ${uploadedDocs.aadhaar ? 'border-rental-trust-green bg-rental-trust-green/5' : 'border-dashed border-gray-300'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {uploadedDocs.aadhaar ? (
                        <CheckCircle className="w-6 h-6 text-rental-trust-green" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium">Aadhaar Card</p>
                        <p className="text-xs text-gray-600">Government issued ID</p>
                      </div>
                    </div>
                    {!uploadedDocs.aadhaar && (
                      <Button 
                        size="sm" 
                        onClick={() => handleDocUpload('aadhaar')}
                        className="bg-rental-teal-500 hover:bg-rental-teal-600"
                      >
                        Upload
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* License Upload */}
              <Card className={`border-2 ${uploadedDocs.license ? 'border-rental-trust-green bg-rental-trust-green/5' : 'border-dashed border-gray-300'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {uploadedDocs.license ? (
                        <CheckCircle className="w-6 h-6 text-rental-trust-green" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium">Driving License</p>
                        <p className="text-xs text-gray-600">Valid driving permit</p>
                      </div>
                    </div>
                    {!uploadedDocs.license && (
                      <Button 
                        size="sm" 
                        onClick={() => handleDocUpload('license')}
                        className="bg-rental-teal-500 hover:bg-rental-teal-600"
                      >
                        Upload
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Address Proof Upload */}
              <Card className={`border-2 ${uploadedDocs.address ? 'border-rental-trust-green bg-rental-trust-green/5' : 'border-dashed border-gray-300'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {uploadedDocs.address ? (
                        <CheckCircle className="w-6 h-6 text-rental-trust-green" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium">Address Proof</p>
                        <p className="text-xs text-gray-600">Utility bill or bank statement</p>
                      </div>
                    </div>
                    {!uploadedDocs.address && (
                      <Button 
                        size="sm" 
                        onClick={() => handleDocUpload('address')}
                        className="bg-rental-teal-500 hover:bg-rental-teal-600"
                      >
                        Upload
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Verification Success */}
        {currentStep === 'verification' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-rental-trust-green/10 rounded-full flex items-center justify-center mx-auto animate-fade-in">
              <CheckCircle className="w-10 h-10 text-rental-trust-green" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-rental-navy-800 mb-2">Verification Complete!</h3>
              <p className="text-rental-navy-600">Your identity has been verified successfully. Welcome to RidePoint!</p>
            </div>
            <Progress value={100} className="h-2" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
