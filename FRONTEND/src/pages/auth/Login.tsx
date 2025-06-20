
import { useEffect } from "react";
import LoginForm from "@/components/auth/login-form";

const Login = () => {
  useEffect(() => {
    document.title = "UDSM Risk Management Information System | Login";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-udsm-blue mb-2">
          UDSM Risk Management Information System
        </h1>
        <p className="text-sm text-muted-foreground">
          University of Dar es Salaam's integrated risk management platform
        </p>
      </div>
      <LoginForm />
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 University of Dar es Salaam. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
