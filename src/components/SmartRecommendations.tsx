
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
import { useAppStore } from "@/hooks/useAppStore";

const SmartRecommendations = () => {
  const { getAvailableVehicles } = useAppStore();
  const available = getAvailableVehicles();
  const top = available
    .filter(v => v.isAvailable)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)
    .map((v, idx) => ({
      id: v.id,
      type: idx === 0 ? 'recommended' : 'trending',
      title: idx === 0 ? 'Top Pick For You' : 'Popular Now',
      vehicle: {
        name: v.name,
        type: v.type,
        price: v.price,
        rating: v.rating || 0,
        distance: 0,
        owner: v.ownerName,
        location: v.location,
        features: v.features || []
      },
      reason: ''
    }));

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
          {top.length === 0 && (
            <div className="text-sm text-rental-navy-500">No recommendations available.</div>
          )}
          {top.map((rec) => (
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
                    {/* Battery removed to avoid mock fields */}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-rental-navy-800">₹{rec.vehicle.price}/day</div>
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
                  {rec.reason && (
                    <p className="text-xs text-rental-navy-500 italic">{rec.reason}</p>
                  )}

                  {/* Action */}
                  <Button size="sm" className="w-full bg-rental-teal-500 hover:bg-rental-teal-600">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No static insights to avoid mock data */}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
