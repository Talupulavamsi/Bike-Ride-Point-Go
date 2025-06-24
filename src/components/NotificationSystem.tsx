
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, X, CheckCircle, Clock, Car } from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';

interface Notification {
  id: string;
  type: 'booking' | 'completion' | 'vehicle_added';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  userRole: 'owner' | 'renter';
  userId: string;
}

const NotificationSystem = ({ userRole, userId }: NotificationSystemProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const { eventEmitter } = useAppStore();

  useEffect(() => {
    const handleVehicleAdded = (vehicle: any) => {
      if (userRole === 'renter') {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'vehicle_added',
          title: 'New Vehicle Available!',
          message: `${vehicle.name} is now available for booking in ${vehicle.location}`,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [notification, ...prev]);
      }
    };

    const handleVehicleBooked = (booking: any) => {
      if (userRole === 'owner' && booking.ownerId === userId) {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'booking',
          title: 'New Booking Received!',
          message: `${booking.renterName} booked ${booking.vehicleName} for ${booking.duration}`,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [notification, ...prev]);
      } else if (userRole === 'renter' && booking.renterId === userId) {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'booking',
          title: 'Booking Confirmed!',
          message: `Your booking for ${booking.vehicleName} is confirmed`,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [notification, ...prev]);
      }
    };

    const handleRideCompleted = (bookingId: string) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'completion',
        title: 'Ride Completed!',
        message: 'Thank you for using our service. Rate your experience!',
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
    };

    eventEmitter.on('vehicleAdded', handleVehicleAdded);
    eventEmitter.on('vehicleBooked', handleVehicleBooked);
    eventEmitter.on('rideCompleted', handleRideCompleted);

    return () => {
      eventEmitter.off('vehicleAdded', handleVehicleAdded);
      eventEmitter.off('vehicleBooked', handleVehicleBooked);
      eventEmitter.off('rideCompleted', handleRideCompleted);
    };
  }, [eventEmitter, userRole, userId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'completion': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'vehicle_added': return <Car className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPanel(!showPanel)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-red-500">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showPanel && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden shadow-lg z-50">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear All
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowPanel(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default NotificationSystem;
