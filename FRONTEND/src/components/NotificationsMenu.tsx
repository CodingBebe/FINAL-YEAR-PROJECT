import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "deadline" | "submission" | "review" | "reminder";
  isRead: boolean;
  color: "blue" | "green" | "yellow" | "red";
}

interface NotificationsMenuProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemoveNotification: (id: string) => void;
}

export function NotificationsMenu({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemoveNotification,
}: NotificationsMenuProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationBackground = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-50 border-l-4 border-l-blue-500";
      case "green": return "bg-green-50 border-l-4 border-l-green-500";
      case "yellow": return "bg-yellow-50 border-l-4 border-l-yellow-500";
      case "red": return "bg-red-50 border-l-4 border-l-red-500";
      default: return "bg-gray-50 border-l-4 border-l-gray-500";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-sm font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={onMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${getNotificationBackground(notification.color)} p-3 rounded-md`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium">{notification.title}</h3>
                    <button
                      onClick={() => onRemoveNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{notification.time}</span>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 