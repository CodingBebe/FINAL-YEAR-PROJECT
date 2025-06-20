import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, ClipboardList, User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { NotificationsMenu } from "@/components/NotificationsMenu";
import udsmLogo from "@/assets/images/udsm-logo.jpg";
import { useUser } from "@/contexts/UserContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "deadline" | "submission" | "review" | "reminder";
  isRead: boolean;
  color: "blue" | "green" | "yellow" | "red";
}

const navigation = [
  {
    name: "Dashboard",
    href: "/champion/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Risks",
    href: "/champion/risks",
    icon: FileText,
  },
  {
    name: "My Submissions",
    href: "/champion/submissions",
    icon: ClipboardList,
  },
];

export default function RiskChampionLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();

  // Add notifications state
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Quarterly Report Due",
      message: "The Q2 2025 risk report is due in 5 days. Please submit on time.",
      time: "3 hours ago",
      type: "deadline",
      isRead: false,
      color: "blue"
    },
    {
      id: "2",
      title: "Risk Submission Reviewed",
      message: "Your submission about 'IT system security vulnerabilities' has been reviewed by the coordinator.",
      time: "Yesterday",
      type: "review",
      isRead: false,
      color: "green"
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const handleLogout = () => {
    toast({
      title: "Logging out...",
      description: "You will be redirected to the login page.",
    });
    navigate("/");
  };

  const handleViewProfile = () => {
    navigate("/champion/profile");
  };

  const handleManageAccount = () => {
    navigate("/champion/account");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#1A365D] px-6 pb-4">
          {/* Profile Section */}
          <div className="flex flex-col items-center py-6 border-b border-blue-800/30">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer flex flex-col items-center">
                  <Avatar className="h-16 w-16 mb-2">
                    <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                    <AvatarFallback className="text-lg bg-blue-900/50 text-white">{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-white leading-tight">{user.name}</h2>
                    <p className="text-sm text-gray-300 mt-0.5">{user.role}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="center">
                <DropdownMenuItem onClick={handleViewProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleManageAccount}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Manage Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            isActive
                              ? "bg-blue-900/50 text-white"
                              : "text-gray-300 hover:text-white hover:bg-blue-900/50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={cn(
                              isActive
                                ? "text-white"
                                : "text-gray-300 group-hover:text-white",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 w-full">
        {/* Top navigation bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                className="h-10 w-auto"
                src={udsmLogo}
                alt="UDSM Logo"
              />
              <h1 className="text-2xl font-bold">Risk Management Dashboard</h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <NotificationsMenu
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onRemoveNotification={handleRemoveNotification}
              />
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 