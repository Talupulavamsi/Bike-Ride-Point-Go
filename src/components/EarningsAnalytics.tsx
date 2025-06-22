
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const EarningsAnalytics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Earnings Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-rental-navy-500 text-center py-8">
          Detailed analytics and insights coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default EarningsAnalytics;
