
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign,
  Target,
  Lightbulb,
  Clock
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const RevenueForecastingModule = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");

  const weeklyForecast = [
    { day: "Mon", predicted: 1200, actual: 1150, accuracy: 96 },
    { day: "Tue", predicted: 800, actual: 850, accuracy: 94 },
    { day: "Wed", predicted: 900, actual: 920, accuracy: 98 },
    { day: "Thu", predicted: 1100, actual: 1080, accuracy: 98 },
    { day: "Fri", predicted: 1500, actual: 1420, accuracy: 95 },
    { day: "Sat", predicted: 2200, actual: null, accuracy: null },
    { day: "Sun", predicted: 1800, actual: null, accuracy: null }
  ];

  const monthlyForecast = [
    { month: "Week 1", predicted: 8000, actual: 7800, accuracy: 97 },
    { month: "Week 2", predicted: 9200, actual: 9100, accuracy: 99 },
    { month: "Week 3", predicted: 8800, actual: 8650, accuracy: 98 },
    { month: "Week 4", predicted: 10500, actual: null, accuracy: null }
  ];

  const peakDays = [
    { date: "Dec 30", event: "New Year Weekend", demandBoost: "+180%", suggestedPrice: "₹250/hr" },
    { date: "Jan 26", event: "Republic Day", demandBoost: "+120%", suggestedPrice: "₹200/hr" },
    { date: "Feb 14", event: "Valentine's Day", demandBoost: "+90%", suggestedPrice: "₹180/hr" }
  ];

  const currentData = selectedPeriod === "weekly" ? weeklyForecast : monthlyForecast;
  const totalPredicted = currentData.reduce((sum, item) => sum + item.predicted, 0);
  const totalActual = currentData.reduce((sum, item) => sum + (item.actual || 0), 0);
  const overallAccuracy = currentData.filter(item => item.actual).reduce((sum, item) => sum + item.accuracy, 0) / currentData.filter(item => item.actual).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-rental-navy-800">Revenue Forecasting</h2>
          <p className="text-rental-navy-600">AI-powered income predictions and optimization</p>
        </div>
        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rental-navy-500">Predicted Revenue</p>
                <p className="text-2xl font-bold text-rental-navy-800">₹{totalPredicted.toLocaleString()}</p>
                <p className="text-sm text-rental-trust-green">You're likely to earn this {selectedPeriod.replace('ly', '')}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-rental-trust-blue/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-rental-trust-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rental-navy-500">Actual Revenue</p>
                <p className="text-2xl font-bold text-rental-navy-800">₹{totalActual.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {totalActual > totalPredicted * 0.95 ? (
                    <TrendingUp className="w-3 h-3 text-rental-trust-green" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <p className="text-sm text-rental-navy-500">vs predicted</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-rental-trust-green/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-rental-trust-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rental-navy-500">Forecast Accuracy</p>
                <p className="text-2xl font-bold text-rental-navy-800">{overallAccuracy?.toFixed(0)}%</p>
                <p className="text-sm text-rental-trust-green">Highly reliable predictions</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-rental-lime-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-rental-lime-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedPeriod === "weekly" ? "day" : "month"} />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, '']} />
              <Line type="monotone" dataKey="predicted" stroke="#0EA5E9" strokeWidth={2} name="Predicted" />
              <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Peak Days Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Upcoming Peak Days</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {peakDays.map((peak, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-rental-trust-yellow/10 to-rental-trust-green/10">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-rental-trust-yellow rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-rental-navy-800">{peak.date} - {peak.event}</p>
                    <p className="text-sm text-rental-navy-600">Demand boost: {peak.demandBoost}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-rental-trust-yellow" />
                    <span className="font-semibold text-rental-navy-800">{peak.suggestedPrice}</span>
                  </div>
                  <p className="text-sm text-rental-navy-500">Suggested rate</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueForecastingModule;
