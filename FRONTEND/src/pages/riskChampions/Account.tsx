import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";

const Account = () => {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  
  // Profile states
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    phone: user?.phone || "",
  });

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!profileData.name || !profileData.email || !profileData.department) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    // Update user profile
    updateUser({
      ...user,
      ...profileData,
    });

    toast({
      title: "Success",
      description: "Profile updated successfully",
    });

    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match",
      });
      return;
    }

    // TODO: Implement password change logic
    toast({
      title: "Success",
      description: "Password changed successfully",
    });

    // Clear form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </div>
            <Button
              variant={isEditing ? "ghost" : "secondary"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileChange} className="space-y-4">
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input
                  value={profileData.name}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  value={profileData.email}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Input value={user?.role} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Department</Label>
                <Input
                  value={profileData.department}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({ ...profileData, department: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Phone Number</Label>
                <Input
                  value={profileData.phone}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                />
              </div>
              {isEditing && (
                <div className="flex justify-end space-x-2">
                  <Button type="submit" className="w-full sm:w-auto">
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current">Current Password</Label>
                <Input
                  id="current"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new">New Password</Label>
                <Input
                  id="new"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto">Update Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account; 