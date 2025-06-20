
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMessage(""); // Clear any previous error

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok) {
      // Optionally store user
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect based on role
      switch (data.role) {
        case "risk_coordinator":
          navigate("/coordinator/dashboard");
          break;
        case "risk_champion":
          navigate("/champion/dashboard");
          break;
        case "committee":
          navigate("/committee/dashboard");
          break;
        case "deputy_vice_chancellor":
          navigate("/dvc/dashboard");
          break;
        case "vice_chancellor":
          navigate("/vc/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } else {
      setErrorMessage(data.message || "Incorrect credentials");
    }
  } catch (error) {
    setErrorMessage("Network error. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


return (
  <Card className="w-[350px] shadow-lg">
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold text-center">UDSM Risk Compass</CardTitle>
      <CardDescription className="text-center">
        Enter your credentials to access the system
      </CardDescription>
    </CardHeader>
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@udsm.ac.tz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-sm text-udsm-blue hover:underline">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* 👇 Error message shown here */}
        {errorMessage && (
          <p className="text-red-600 text-sm text-center">{errorMessage}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full bg-udsm-blue hover:bg-udsm-blue/90"
          disabled={isLoading}
        >
          {isLoading ? "Authenticating..." : "Sign In"}
        </Button>
      </CardFooter>
    </form>
  </Card>
);
}
export default LoginForm;
