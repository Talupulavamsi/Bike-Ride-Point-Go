import { useMemo, useState } from "react";
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
import { useVehicleStore } from "@/hooks/useVehicleStore";

const EnhancedAnalytics = () => {
  const [activeTab, setActiveTab] = useState("performance");
  const { vehicles, bookings, stats } = useVehicleStore();

  // Build monthly aggregates from real bookings (last 6 months)
  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const conversionData = useMemo(() => {
    const now = new Date();
    const buckets: { [k: string]: { month: string; bookings: number; revenue: number } } = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets[key] = { month: `${monthLabels[d.getMonth()]}`, bookings: 0, revenue: 0 };
    }
    bookings.forEach(b => {
      const d = new Date(b.startDate);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key in buckets) {
        buckets[key].bookings += 1;
        buckets[key].revenue += b.totalAmount || 0;
      }
    });
    return Object.values(buckets);
  }, [bookings]);

  // Build booking status distribution
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => { counts[b.status] = (counts[b.status] || 0) + 1; });
    const colors = ["#0EA5E9","#10B981","#F59E0B","#EF4444","#8B5CF6"];
    return Object.entries(counts).map(([status, count], idx) => ({ segment: status, value: count, color: colors[idx % colors.length] }));
  }, [bookings]);

  // Vehicle ranking from real vehicles
  const vehiclePerformance = useMemo(() => vehicles.map(v => ({
    vehicle: v.name,
    bookings: v.totalBookings || 0,
    revenue: v.totalEarnings || 0,
    rating: v.rating || 0,
    efficiency: 0,
  })).sort((a,b) => b.revenue - a.revenue), [vehicles]);

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
          <TabsTrigger value="conversion">Monthly</TabsTrigger>
          <TabsTrigger value="behavior">Status Mix</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* KPI Cards from real data */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-rental-navy-500">Total Bookings</p>
                    <p className="text-2xl font-bold text-rental-navy-800">{bookings.length}</p>
                    <p className="text-sm text-rental-navy-400">All time</p>
                  </div>
                  <Target className="w-8 h-8 text-rental-trust-green" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-rental-navy-500">Total Earnings</p>
                    <p className="text-2xl font-bold text-rental-navy-800">₹{conversionData.reduce((s,d)=>s+d.revenue,0).toLocaleString()}</p>
                    <p className="text-sm text-rental-navy-400">Sum of bookings</p>
                  </div>
                  <Clock className="w-8 h-8 text-rental-teal-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-rental-navy-500">Available Vehicles</p>
                    <p className="text-2xl font-bold text-rental-navy-800">{vehicles.filter(v=>v.isAvailable).length}</p>
                    <p className="text-sm text-rental-navy-400">Out of {vehicles.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-rental-lime-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-rental-navy-500">Avg Rating</p>
                    <p className="text-2xl font-bold text-rental-navy-800">{stats.averageRating}</p>
                    <p className="text-sm text-rental-navy-400">Across fleet</p>
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
              <CardTitle>Monthly Bookings & Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="bookings" fill="#10B981" name="Bookings" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ segment, value }) => `${segment}: ${value}` as any}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
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
                <CardTitle>Statuses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {statusDistribution.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: segment.color }}></div>
                        <span className="text-sm">{segment.segment}</span>
                      </div>
                      <span className="text-sm font-semibold">{segment.value}</span>
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
