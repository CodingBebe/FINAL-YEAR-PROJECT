// src/pages/riskCoordinator/Dashboard.tsx
import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Coordinator Dashboard | UDSM RMIS";
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, Risk Coordinator</h1>
      <p>This is your dashboard. Use the sidebar to manage risks.</p>
    </div>
  );
};

export default Dashboard;
