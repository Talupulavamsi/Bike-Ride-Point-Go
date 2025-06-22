
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const BookingManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Booking Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-rental-navy-500 text-center py-8">
          Booking management features coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default BookingManagement;
