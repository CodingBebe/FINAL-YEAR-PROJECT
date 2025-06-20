import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NOTIFICATION_TYPES = [
  "All Types",
  "Risk",
  "Reminder",
  "Update",
  "System",
  "User",
  "Security",
];
const PRIORITIES = ["All Priorities", "High", "Medium", "Low"];

const INITIAL_NOTIFICATIONS = [
  {
    type: "Risk",
    priority: "High",
    title: "New High Risk Submitted",
    description: "A new high risk has been submitted by the College of Engineering.",
    date: "May 15, 2023 at 10:30 AM",
    status: "new",
    icon: "error",
    read: false,
    fullMessage: "A new high risk has been submitted by the College of Engineering. Please review the details and take necessary action."
  },
  {
    type: "Reminder",
    priority: "Medium",
    title: "Risk Assessment Overdue",
    description: "The quarterly risk assessment for the Department of Computer Science is overdue.",
    date: "May 14, 2023 at 09:45 AM",
    status: "overdue",
    icon: "warning",
    read: false,
    fullMessage: "The quarterly risk assessment for the Department of Computer Science is overdue. Please ensure the assessment is completed as soon as possible."
  },
  {
    type: "Risk",
    priority: "Low",
    title: "Mitigation Plan Approved",
    description: "The mitigation plan for identified risk in the Faculty of Education has been approved.",
    date: "May 13, 2023 at 04:20 PM",
    status: "approved",
    icon: "success",
    read: true,
    fullMessage: "The mitigation plan for the identified risk in the Faculty of Education has been approved. No further action is required at this time."
  },
  {
    type: "System",
    priority: "Low",
    title: "System Maintenance Scheduled",
    description: "Scheduled maintenance for the risk management system will occur on May 20, 2023, from 08:00 to 12:00.",
    date: "May 12, 2023 at 06:00 PM",
    status: "info",
    icon: "info",
    read: true,
    fullMessage: "Scheduled maintenance for the risk management system will occur on May 20, 2023, from 08:00 to 12:00. Please plan accordingly."
  },
  {
    type: "User",
    priority: "Low",
    title: "New User Account Created",
    description: "A new user account has been created for John Doe in the Department of Finance.",
    date: "May 11, 2023 at 02:15 PM",
    status: "new",
    icon: "user",
    read: false,
    fullMessage: "A new user account has been created for John Doe in the Department of Finance."
  },
  {
    type: "Security",
    priority: "Medium",
    title: "Password Reset Request",
    description: "A password reset request has been initiated for the user account associated with jane.smith@example.com.",
    date: "May 10, 2023 at 08:55 PM",
    status: "info",
    icon: "lock",
    read: true,
    fullMessage: "A password reset request has been initiated for the user account associated with jane.smith@example.com. If this was not you, please contact support."
  },
];

const statusColor = {
  new: "text-blue-600",
  overdue: "text-orange-600",
  approved: "text-green-600",
  info: "text-gray-600",
};

const Notifications = () => {
  const [type, setType] = useState(NOTIFICATION_TYPES[0]);
  const [priority, setPriority] = useState(PRIORITIES[0]);
  const [search, setSearch] = useState("");
  const [showRead, setShowRead] = useState(true);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [openIdx, setOpenIdx] = useState(null);

  const filtered = notifications.filter((n) => {
    const matchesType = type === "All Types" || n.type === type;
    const matchesPriority = priority === "All Priorities" || n.priority === priority;
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    const matchesRead = showRead ? true : !n.read;
    return matchesType && matchesPriority && matchesSearch && matchesRead;
  });

  const handleOpen = (idx) => {
    setOpenIdx(idx);
    setNotifications((prev) =>
      prev.map((n, i) => (i === idx ? { ...n, read: true } : n))
    );
  };

  const handleClose = () => setOpenIdx(null);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Notifications</h1>
      <p className="text-muted-foreground mb-6">Stay informed about important updates and alerts.</p>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Customize your notification settings to filter and manage alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="w-full md:w-64"
              placeholder="Search notifications..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showRead}
                onChange={e => setShowRead(e.target.checked)}
                id="showRead"
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <label htmlFor="showRead" className="text-sm">Show Read</label>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>View the latest notifications based on your preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No notifications found.</div>
            ) : (
              filtered.map((n, idx) => (
                <button
                  key={idx}
                  className={`w-full text-left flex items-start justify-between border-b last:border-b-0 py-4 focus:outline-none ${!n.read ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-muted/50"}`}
                  onClick={() => handleOpen(notifications.indexOf(n))}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[n.status] || "bg-gray-400"}`}></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{n.title}</span>
                        {!n.read && n.status === "new" && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">New</span>}
                      </div>
                      <div className="text-sm text-muted-foreground">{n.description}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap min-w-fit">{n.date}</div>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      {/* Modal for notification details */}
      {openIdx !== null && notifications[openIdx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={handleClose}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{notifications[openIdx].title}</h2>
            <div className="text-sm text-gray-500 mb-4">{notifications[openIdx].date}</div>
            <div className="mb-4">{notifications[openIdx].fullMessage}</div>
            <Button onClick={handleClose} className="w-full">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications; 