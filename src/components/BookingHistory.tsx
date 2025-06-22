
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const BookingHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Booking History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-rental-navy-500 text-center py-8">
          Your booking history will appear here...
        </p>
      </CardContent>
    </Card>
  );
};

export default BookingHistory;
