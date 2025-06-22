
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Car,
  Bike,
  Battery,
  Star
} from "lucide-react";

const SmartRecommendations = () => {
  const recommendations = [
    {
      id: "rec1",
      type: "recommended",
      title: "Perfect for Your Commute",
      vehicle: {
        name: "Hero Splendor Plus",
        type: "bike",
        price: 150,
        rating: 4.8,
        distance: 0.3,
        owner: "Rajesh Kumar",
        location: "MG Road, Bangalore",
        features: ["Fuel Efficient", "Well Maintained"]
      },
      reason: "Based on your frequent MG Road trips"
    },
    {
      id: "rec2", 
      type: "trending",
      title: "Trending This Weekend",
      vehicle: {
        name: "Ather 450X",
        type: "scooter",
        price: 200,
        rating: 4.9,
        distance: 0.5,
        battery: 85,
        owner: "Amit Patel",
        location: "Commercial Street",
        features: ["Electric", "Fast Charging"]
      },
      reason: "High demand in your area"
    },
    {
      id: "rec3",
      type: "price_drop",
      title: "Price Drop Alert",
      vehicle: {
        name: "Maruti Swift",
        type: "car",
        price: 700,
        originalPrice: 800,
        rating: 4.6,
        distance: 0.8,
        owner: "Priya Singh",
        location: "Brigade Road",
        features: ["AC", "Bluetooth", "GPS"]
      },
      reason: "₹100 off your favorite car type"
    }
  ];

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return <Bike className="w-4 h-4" />;
      case 'car': return <Car className="w-4 h-4" />;
      case 'scooter': return <Bike className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'recommended': return <Sparkles className="w-4 h-4 text-rental-trust-yellow" />;
      case 'trending': return <TrendingUp className="w-4 h-4 text-rental-trust-green" />;
      case 'price_drop': return <DollarSign className="w-4 h-4 text-rental-trust-blue" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'recommended': return 'border-rental-trust-yellow bg-rental-trust-yellow/5';
      case 'trending': return 'border-rental-trust-green bg-rental-trust-green/5';
      case 'price_drop': return 'border-rental-trust-blue bg-rental-trust-blue/5';
      default: return 'border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-rental-trust-yellow" />
          <span>AI Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <Card key={rec.id} className={`border-2 ${getRecommendationColor(rec.type)}`}>
              <CardContent className="p-4">
                {/* Recommendation Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getRecommendationIcon(rec.type)}
                    <span className="text-sm font-semibold text-rental-navy-700">{rec.title}</span>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-rental-teal-100 rounded-lg flex items-center justify-center">
                      {getVehicleIcon(rec.vehicle.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-rental-navy-800 text-sm">{rec.vehicle.name}</h4>
                      <p className="text-xs text-rental-navy-500">{rec.vehicle.owner}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{rec.vehicle.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-rental-navy-400" />
                      <span>{rec.vehicle.distance}km</span>
                    </div>
                    {rec.vehicle.battery && (
                      <div className="flex items-center space-x-1">
                        <Battery className="w-3 h-3 text-rental-trust-green" />
                        <span>{rec.vehicle.battery}%</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      {rec.vehicle.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{rec.vehicle.originalPrice}</span>
                      )}
                      <div className="font-bold text-rental-navy-800">₹{rec.vehicle.price}/day</div>
                    </div>
                    {rec.vehicle.originalPrice && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                        Save ₹{rec.vehicle.originalPrice - rec.vehicle.price}
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {rec.vehicle.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Reason */}
                  <p className="text-xs text-rental-navy-500 italic">{rec.reason}</p>

                  {/* Action */}
                  <Button size="sm" className="w-full bg-rental-teal-500 hover:bg-rental-teal-600">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Insights */}
        <div className="mt-6 bg-gradient-to-r from-rental-teal-50 to-rental-lime-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-rental-teal-500" />
            </div>
            <div>
              <h4 className="font-semibold text-rental-navy-800 mb-1">Today's AI Insights</h4>
              <ul className="text-sm text-rental-navy-600 space-y-1">
                <li>• Peak demand expected between 2-4 PM in your area</li>
                <li>• Electric vehicles are 15% cheaper today due to government incentives</li>
                <li>• Weekend rates are 20% lower for advance bookings</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
