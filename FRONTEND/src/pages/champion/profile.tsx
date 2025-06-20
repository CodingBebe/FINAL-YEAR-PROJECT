import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  // Use the same user data as in the layout
  const user = {
    name: "Angel Emmanuel",
    email: "angel.emmanuel@udsm.ac.tz",
    role: "Risk champion",
    department: "ICT Department",
    avatarUrl: null,
    initials: "AE"
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
              <AvatarFallback className="text-2xl bg-blue-900/50 text-white">{user.initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.role}</p>
            </div>
            <div className="w-full max-w-md space-y-4 mt-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Department</h3>
                <p className="text-gray-600">{user.department}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Role</h3>
                <p className="text-gray-600">{user.role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 