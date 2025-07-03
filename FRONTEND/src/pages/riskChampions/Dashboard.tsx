import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Bell, AlertTriangle, FileCheck, Clock, CheckCircle2, Edit2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/DashboardHeader"
import udsmLogo from "@/assets/images/udsm-logo.jpg"
import { useUser } from "@/contexts/UserContext"

interface DashboardStats {
  totalSubmissions: number;
  pendingReviews: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
}

interface Submission {
  id: string;
  title: string;
  quarter: string;
  status: string;
  year?: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "deadline" | "submission" | "review" | "reminder";
  isRead: boolean;
  color: "blue" | "green" | "yellow" | "red";
}

const getSeverity = (score: number) => {
  if (score >= 17) return "veryHigh";
  if (score >= 10) return "high";
  if (score >= 4) return "moderate";
  return "low";
};

export default function RiskChampionDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showReadNotifications, setShowReadNotifications] = useState(false);
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalSubmissions: 0,
    pendingReviews: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0
  });
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch submissions (mock data for now)
    const mockSubmissions: Submission[] = [
      {
        id: "1",
        title: "IT Infrastructure Risk Assessment",
        quarter: "Q1 2025",
        status: "draft"
      },
      {
        id: "2",
        title: "Budget Allocation Risk Report",
        quarter: "Q1 2025",
        status: "submitted"
      },
      {
        id: "3",
        title: "Staff Training Gap Analysis",
        quarter: "Q4 2025",
        status: "approved"
      }
    ];

    setSubmissions(mockSubmissions);
  }, []);

  useEffect(() => {
    // Fetch real submissions and update all stats for champion
    const fetchChampionStats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/submissions", { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Filter submissions where the current user is the principalOwner or supportingOwner
          const championSubmissions = data.data.filter((s: any) =>
            s.principalOwner === user.name ||
            (Array.isArray(s.supportingOwner)
              ? s.supportingOwner.includes(user.name)
              : s.supportingOwner === user.name) ||
            s.principalOwner === user.email ||
            (Array.isArray(s.supportingOwner)
              ? s.supportingOwner.includes(user.email)
              : s.supportingOwner === user.email)
          );
          setStats({
            totalSubmissions: championSubmissions.length,
            pendingReviews: championSubmissions.filter((s: any) => s.status === 'submitted' || s.status === 'pending' || s.status === 'under review').length,
            approvedSubmissions: championSubmissions.filter((s: any) => s.status === 'approved').length,
            rejectedSubmissions: championSubmissions.filter((s: any) => s.status === 'rejected').length
          });
        } else {
          setStats({ totalSubmissions: 0, pendingReviews: 0, approvedSubmissions: 0, rejectedSubmissions: 0 });
        }
      } catch (err) {
        setStats({ totalSubmissions: 0, pendingReviews: 0, approvedSubmissions: 0, rejectedSubmissions: 0 });
        console.error("Champion stats fetch error:", err);
      }
    };
    fetchChampionStats();
  }, [user.name, user.email]);

  useEffect(() => {
    // Fetch notifications (mock data for now)
    const mockNotifications: Notification[] = [
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
      },
      {
        id: "3",
        title: "New Risk Category Added",
        message: "A new risk category 'Cybersecurity Threats' has been added to the system.",
        time: "2 days ago",
        type: "reminder",
        isRead: false,
        color: "yellow"
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  useEffect(() => {
    // Fetch real submissions and aggregate for chart
    const fetchAndAggregate = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/submissions", { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Filter by unit (user.unit)
          const filtered = data.data.filter((s: any) => s.unit_id === user.unit);
          // Group by quarter (e.g., Q1 2025)
          const quarterMap: Record<string, { low: number; moderate: number; high: number; veryHigh: number; total: number }> = {};
          filtered.forEach((s: any) => {
            const quarter = (s.timePeriod || "-") + " " + (s.year || "-");
            const score = typeof s.rating === "number" ? s.rating : (s.likelihood && s.impact ? s.likelihood * s.impact : 0);
            const sev = getSeverity(score);
            if (!quarterMap[quarter]) {
              quarterMap[quarter] = { low: 0, moderate: 0, high: 0, veryHigh: 0, total: 0 };
            }
            quarterMap[quarter][sev]++;
            quarterMap[quarter].total++;
          });
          // Convert to array and sort by quarter
          const quarters = Object.keys(quarterMap).sort();
          const chartData = quarters.map(q => ({ quarter: q, ...quarterMap[q] }));
          setTrendData(chartData);
        } else {
          setTrendData([]);
        }
      } catch (err) {
        setTrendData([]);
        console.error("Risk trend fetch error:", err);
      }
    };
    fetchAndAggregate();
  }, [user.unit]);

  // Function to check if a submission is editable
  const isSubmissionEditable = (submission: Submission) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
    
    // Convert quarter string to number (e.g., "Q1" -> 1)
    const submissionQuarter = parseInt(submission.quarter.substring(1));
    
    // Submission is editable if:
    // 1. It's in the current quarter and year
    // 2. It's not already approved
    return (
      submission.year === currentYear &&
      submissionQuarter === currentQuarter &&
      submission.status !== 'approved'
    );
  };

  // Function to get quarter end date
  const getQuarterEndDate = (quarter: string, year: number) => {
    const quarterNumber = parseInt(quarter.substring(1));
    const month = quarterNumber * 3;
    return new Date(year, month, 0);
  };

  // Function to handle edit submission
  const handleEditSubmission = (submissionId: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    if (!isSubmissionEditable(submission)) {
      toast({
        title: "Cannot Edit Submission",
        description: "This submission is no longer editable as its quarter has expired or it has been approved.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to edit page (you'll need to implement this)
    // router.push(`/risk-champion/submissions/${submissionId}/edit`);
    toast({
      title: "Edit Submission",
      description: `Editing submission for ${submission.quarter} ${submission.year}`,
    });
  };

  const getNotificationBackground = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 border-l-4 border-l-blue-500";
      case "green":
        return "bg-green-50 border-l-4 border-l-green-500";
      case "yellow":
        return "bg-yellow-50 border-l-4 border-l-yellow-500";
      case "red":
        return "bg-red-50 border-l-4 border-l-red-500";
      default:
        return "bg-gray-50 border-l-4 border-l-gray-500";
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
    // After marking all as read, remove them after a short delay
    setTimeout(() => {
      setNotifications([]);
    }, 500);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Function to handle notification click
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    // After a short delay, remove the notification
    setTimeout(() => {
      removeNotification(id);
    }, 500);
  };

  // Function to add a new notification
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  // Example function to handle submission events
  const handleSubmissionEvent = (type: "submission" | "deadline" | "review", details: any) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: type === "submission" ? "Risk Submitted Successfully" :
            type === "deadline" ? "Submission Deadline Reminder" :
            "Risk Review Update",
      message: type === "submission" ? `Your risk "${details.title}" has been submitted successfully.` :
               type === "deadline" ? `The deadline for ${details.quarter} submission is approaching.` :
               `Your risk "${details.title}" has been ${details.status}.`,
      time: "Just now",
      type: type,
      isRead: false,
      color: type === "submission" ? "green" :
             type === "deadline" ? "blue" :
             details.status === "approved" ? "green" : "red"
    };
    addNotification(newNotification);
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Filter notifications based on read status
  const filteredNotifications = notifications.filter(notification => 
    showReadNotifications ? true : !notification.isRead
  );

  // Function to get notification icon
  const getNotificationIcon = (category: string) => {
    switch (category) {
      case 'deadline':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'submission':
        return <FileCheck className="h-5 w-5 text-blue-500" />;
      case 'approval':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationStyle = (type: string, isRead: boolean) => {
    const baseStyle = "border transition-colors duration-200";
    const readStyle = isRead ? "bg-gray-50" : "bg-white";
    
    switch (type) {
      case "warning":
        return `${baseStyle} ${readStyle} border-yellow-100 hover:bg-yellow-50`;
      case "success":
        return `${baseStyle} ${readStyle} border-green-100 hover:bg-green-50`;
      case "info":
        return `${baseStyle} ${readStyle} border-blue-100 hover:bg-blue-50`;
      case "error":
        return `${baseStyle} ${readStyle} border-red-100 hover:bg-red-50`;
      default:
        return `${baseStyle} ${readStyle} border-gray-100 hover:bg-gray-50`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Submissions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Submissions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejectedSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trends Section */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Your Unit Risk Trends</h2>
                <Tabs defaultValue="quarterly" className="w-[200px]">
                  <TabsList>
                    <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#4B5563" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="low" stroke="#10B981" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="moderate" stroke="#F59E0B" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="high" stroke="#EF4444" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="veryHigh" stroke="#991B1B" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#991B1B] rounded-full"></div>
                  <span>Very High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#4B5563] rounded-full"></div>
                  <span>Total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Section */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Notifications
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${getNotificationBackground(notification.color)} p-4 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-80`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No new notifications
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 