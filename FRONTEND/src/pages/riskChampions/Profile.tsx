import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";

export default function Profile() {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                <AvatarFallback className="text-2xl bg-blue-900/50 text-white">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.role}</p>
            <p className="text-sm text-muted-foreground">{user.unit}</p>
          </CardHeader>
        </Card>

        {/* User Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                <dd className="text-sm">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-sm">{user.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Employee ID</dt>
                <dd className="text-sm">{user.employeeId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Unit</dt>
                <dd className="text-sm">{user.unit}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Joined Date</dt>
                <dd className="text-sm">{user.joinedDate}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <dt className="text-sm font-medium text-blue-600">Reports Submitted</dt>
                <dd className="mt-1 text-2xl font-semibold text-blue-900">{user.reportsSubmitted}</dd>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <dt className="text-sm font-medium text-green-600">Active Risks</dt>
                <dd className="mt-1 text-2xl font-semibold text-green-900">{user.activeRisks}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 