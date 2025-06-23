
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  MapPin, 
  TrendingUp, 
  Plus, 
  DollarSign,
  Clock,
  AlertTriangle
} from "lucide-react";

const SeasonalDemandHeatmaps = () => {
  const [selectedSeason, setSelectedSeason] = useState("current");

  const demandZones = [
    { 
      area: "MG Road", 
      demand: "high", 
      intensity: 85, 
      recommendations: ["Add 2 more scooters", "Increase price by 15%"],
      avgBookings: 45,
      revenue: 6800
    },
    { 
      area: "Brigade Road", 
      demand: "medium", 
      intensity: 65, 
      recommendations: ["Maintain current fleet", "Consider weekend surge pricing"],
      avgBookings: 28,
      revenue: 4200
    },
    { 
      area: "Commercial Street", 
      demand: "high", 
      intensity: 78, 
      recommendations: ["Add 1 more vehicle", "Optimize pricing for peak hours"],
      avgBookings: 38,
      revenue: 5700
    },
    { 
      area: "Koramangala", 
      demand: "very-high", 
      intensity: 92, 
      recommendations: ["Urgent: Add 3 vehicles", "Increase price by 20%"],
      avgBookings: 56,
      revenue: 8400
    },
    { 
      area: "HSR Layout", 
      demand: "low", 
      intensity: 35, 
      recommendations: ["Relocate 1 vehicle", "Consider promotional pricing"],
      avgBookings: 15,
      revenue: 2250
    },
    { 
      area: "Whitefield", 
      demand: "medium", 
      intensity: 58, 
      recommendations: ["Monitor weekend patterns", "Add electric vehicles"],
      avgBookings: 25,
      revenue: 3750
    }
  ];

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "very-high": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getDemandTextColor = (demand: string) => {
    switch (demand) {
      case "very-high": return "text-red-600";
      case "high": return "text-orange-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const seasonalTrends = {
    current: { label: "Current Week", multiplier: 1.0 },
    summer: { label: "Summer Peak", multiplier: 1.4 },
    monsoon: { label: "Monsoon Season", multiplier: 0.7 },
    festivals: { label: "Festival Season", multiplier: 1.8 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-rental-navy-800">Demand Heatmaps</h2>
          <p className="text-rental-navy-600">Real-time city-wide demand intelligence</p>
        </div>
        <Tabs value={selectedSeason} onValueChange={setSelectedSeason}>
          <TabsList>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="summer">Summer</TabsTrigger>
            <TabsTrigger value="monsoon">Monsoon</TabsTrigger>
            <TabsTrigger value="festivals">Festivals</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Season Info */}
      <Card className="bg-gradient-to-r from-rental-trust-blue/10 to-rental-teal-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-rental-navy-800">
                {seasonalTrends[selectedSeason as keyof typeof seasonalTrends].label}
              </h3>
              <p className="text-rental-navy-600">
                Demand multiplier: {seasonalTrends[selectedSeason as keyof typeof seasonalTrends].multiplier}x
              </p>
            </div>
            <Badge variant="outline" className="text-rental-trust-blue border-rental-trust-blue">
              Live Data
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Demand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demandZones.map((zone, index) => {
          const adjustedIntensity = Math.round(zone.intensity * seasonalTrends[selectedSeason as keyof typeof seasonalTrends].multiplier);
          const adjustedBookings = Math.round(zone.avgBookings * seasonalTrends[selectedSeason as keyof typeof seasonalTrends].multiplier);
          const adjustedRevenue = Math.round(zone.revenue * seasonalTrends[selectedSeason as keyof typeof seasonalTrends].multiplier);
          
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{zone.area}</CardTitle>
                        <div className={`w-4 h-4 rounded-full ${getDemandColor(zone.demand)}`}></div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Intensity Bar */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-rental-navy-600">Demand Intensity</span>
                            <span className="text-sm font-semibold">{adjustedIntensity}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getDemandColor(zone.demand)}`}
                              style={{ width: `${Math.min(adjustedIntensity, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold text-rental-navy-800">{adjustedBookings}</p>
                            <p className="text-xs text-rental-navy-500">Avg Bookings</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-rental-navy-800">₹{adjustedRevenue}</p>
                            <p className="text-xs text-rental-navy-500">Weekly Revenue</p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="text-center">
                          <Badge variant="outline" className={getDemandTextColor(zone.demand)}>
                            {zone.demand.replace('-', ' ').toUpperCase()} DEMAND
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
                    <h4 className="font-semibold">{zone.area} Recommendations:</h4>
                    <ul className="text-sm space-y-1">
                      {zone.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-rental-trust-blue">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              <span>High Priority Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-semibold text-orange-700">Koramangala</p>
                  <p className="text-sm text-orange-600">Add 3 vehicles immediately</p>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-semibold text-orange-700">MG Road</p>
                  <p className="text-sm text-orange-600">Increase pricing by 15%</p>
                </div>
                <Button size="sm" variant="outline">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <TrendingUp className="w-5 h-5" />
              <span>Optimization Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-semibold text-green-700">HSR Layout</p>
                  <p className="text-sm text-green-600">Consider vehicle relocation</p>
                </div>
                <Button size="sm" variant="outline">
                  <MapPin className="w-4 h-4 mr-1" />
                  Relocate
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-semibold text-green-700">Weekend Surge</p>
                  <p className="text-sm text-green-600">Enable dynamic pricing</p>
                </div>
                <Button size="sm" variant="outline">
                  <Clock className="w-4 h-4 mr-1" />
                  Enable
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeasonalDemandHeatmaps;
