
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Award,
  Calendar,
  DollarSign
} from "lucide-react";

const EnhancedAnalytics = () => {
  const [activeTab, setActiveTab] = useState("performance");

  const conversionData = [
    { month: "Jan", views: 1200, bookings: 180, rate: 15 },
    { month: "Feb", views: 1400, bookings: 220, rate: 16 },
    { month: "Mar", views: 1600, bookings: 280, rate: 18 },
    { month: "Apr", views: 1800, bookings: 340, rate: 19 },
    { month: "May", views: 2000, bookings: 420, rate: 21 },
    { month: "Jun", views: 2200, bookings: 480, rate: 22 }
  ];

  const tripDurationData = [
    { duration: "< 1hr", count: 45, percentage: 25 },
    { duration: "1-3hrs", count: 72, percentage: 40 },
    { duration: "3-6hrs", count: 36, percentage: 20 },
    { duration: "6-12hrs", count: 18, percentage: 10 },
    { duration: "> 12hrs", count: 9, percentage: 5 }
  ];

  const renterReturnData = [
    { segment: "New Users", value: 35, color: "#0EA5E9" },
    { segment: "Returning (2-5 trips)", value: 45, color: "#10B981" },
    { segment: "Loyal (5+ trips)", value: 20, color: "#F59E0B" }
  ];

  const vehiclePerformance = [
    { vehicle: "Hero Splendor", bookings: 45, revenue: 6750, rating: 4.8, efficiency: 95 },
    { vehicle: "Ather 450X", bookings: 38, revenue: 7600, rating: 4.9, efficiency: 92 },
    { vehicle: "Maruti Swift", bookings: 32, revenue: 25600, rating: 4.6, efficiency: 88 },
    { vehicle: "Honda Activa", bookings: 28, revenue: 4200, rating: 4.7, efficiency: 85 },
    { vehicle: "TVS Apache", bookings: 15, revenue: 2250, rating: 4.4, efficiency: 65 }
  ];

  const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-rental-navy-800">Enhanced Analytics</h2>
          <p className="text-rental-navy-600">Deep insights into your business performance</p>
        </div>
        <Badge variant="outline" className="text-rental-trust-blue border-rental-trust-blue">
          Real-time Data
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-rental-navy-500">Booking Conversion</p>
                    <p className="text-2xl font-bold text-rental-navy-800">22%</p>
                    <p className="text-sm text-rental-trust-green">+3% from last month</p>
                  </div>
                  <Target className="w-8 h-8 text-rental-trust-green" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-rental-navy-500">Avg Trip Duration</p>
                    <p className="text-2xl font-bold text-rental-navy-800">2.5hrs</p>
                    <p className="text-sm text-rental-trust-green">+15min from last month</p>
                  </div>
                  <Clock className="w-8 h-8 text-rental-teal-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-rental-navy-500">Return Rate</p>
                    <p className="text-2xl font-bold text-rental-navy-800">65%</p>
                    <p className="text-sm text-rental-trust-green">+8% from last month</p>
                  </div>
                  <Users className="w-8 h-8 text-rental-lime-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-rental-navy-500">Fleet Efficiency</p>
                    <p className="text-2xl font-bold text-rental-navy-800">89%</p>
                    <p className="text-sm text-rental-trust-green">+5% from last month</p>
                  </div>
                  <Award className="w-8 h-8 text-rental-trust-yellow" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Conversion Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="views" fill="#0EA5E9" name="Views" />
                  <Bar yAxisId="left" dataKey="bookings" fill="#10B981" name="Bookings" />
                  <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#F59E0B" strokeWidth={3} name="Conversion Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Duration Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={tripDurationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ duration, percentage }) => `${duration}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {tripDurationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={renterReturnData}>
                    <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background dataKey="value" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {renterReturnData.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: segment.color }}></div>
                        <span className="text-sm">{segment.segment}</span>
                      </div>
                      <span className="text-sm font-semibold">{segment.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Performance Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehiclePerformance.map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rental-teal-100 text-rental-teal-600 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-rental-navy-800">{vehicle.vehicle}</p>
                        <p className="text-sm text-rental-navy-500">{vehicle.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <p className="text-lg font-bold text-rental-navy-800">₹{vehicle.revenue.toLocaleString()}</p>
                        <p className="text-xs text-rental-navy-500">Revenue</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-rental-navy-800">{vehicle.rating}</p>
                        <p className="text-xs text-rental-navy-500">Rating</p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-rental-trust-green"
                              style={{ width: `${vehicle.efficiency}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold">{vehicle.efficiency}%</span>
                        </div>
                        <p className="text-xs text-rental-navy-500">Efficiency</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalytics;
