
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, X, CheckCircle, Clock, Car } from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';

interface Notification {
  id: string;
  type: 'booking' | 'completion' | 'vehicle_added' | 'cancellation';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  userRole: 'owner' | 'user';
  userId: string;
}

const NotificationSystem = ({ userRole, userId }: NotificationSystemProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const { vehicles, bookings } = useAppStore();

  // Monitor for new bookings and create notifications
  useEffect(() => {
    const latestBooking = bookings[0]; // Most recent booking
    if (latestBooking) {
      if (userRole === 'owner' && latestBooking.ownerId === userId) {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'booking',
          title: 'New Booking Received!',
          message: `${latestBooking.renterName} booked ${latestBooking.vehicleName} for ${latestBooking.duration}`,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => {
          // Avoid duplicate notifications
          if (prev.some(n => n.message === notification.message)) return prev;
          return [notification, ...prev];
        });
      } else if (userRole === 'user' && latestBooking.renterId === userId) {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'booking',
          title: 'Booking Confirmed!',
          message: `Your booking for ${latestBooking.vehicleName} is confirmed`,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => {
          // Avoid duplicate notifications
          if (prev.some(n => n.message === notification.message)) return prev;
          return [notification, ...prev];
        });
      }
    }
  }, [bookings, userRole, userId]);

  // Monitor cancellations and notify renter/owner
  useEffect(() => {
    const latest = bookings[0];
    if (!latest) return;
    if (latest.status === 'cancelled') {
      if (userRole === 'owner' && latest.ownerId === userId) {
        const n: Notification = {
          id: `cancel_owner_${latest.id}`,
          type: 'cancellation',
          title: 'Booking Cancelled',
          message: `${latest.renterName} cancelled booking for ${latest.vehicleName}`,
          timestamp: new Date(),
          read: false,
        };
        setNotifications(prev => (prev.some(p => p.id === n.id) ? prev : [n, ...prev]));
      }
      if (userRole === 'user' && latest.renterId === userId) {
        const n: Notification = {
          id: `cancel_user_${latest.id}`,
          type: 'cancellation',
          title: 'Booking Cancelled',
          message: `Your booking for ${latest.vehicleName} has been cancelled`,
          timestamp: new Date(),
          read: false,
        };
        setNotifications(prev => (prev.some(p => p.id === n.id) ? prev : [n, ...prev]));
      }
    }
  }, [bookings, userRole, userId]);

  // Monitor for new vehicles and create notifications for users
  useEffect(() => {
    if (userRole === 'user' && vehicles.length > 0) {
      const latestVehicle = vehicles[0]; // Most recent vehicle
      if (latestVehicle && latestVehicle.isAvailable) {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'vehicle_added',
          title: 'New Vehicle Available!',
          message: `${latestVehicle.name} is now available for booking in ${latestVehicle.location}`,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => {
          // Avoid duplicate notifications
          if (prev.some(n => n.message === notification.message)) return prev;
          return [notification, ...prev];
        });
      }
    }
  }, [vehicles, userRole]);

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
