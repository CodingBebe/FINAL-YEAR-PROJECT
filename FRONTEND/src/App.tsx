import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
// Removed: import { Toaster as Sonner } from "sonner"; // 'Sonner' is a type, not a component. You only need the 'Toaster' component.
import { type PropsWithChildren } from "react"; // Not directly used in App.tsx unless you have a wrapper component

import Login from "./pages/auth/Login";

// Risk Champion Pages
import RiskChampionLayout from "@/components/layout/RiskChampionLayout";
import RiskChampionDashboard from "@/pages/riskChampions/Dashboard";
import Risks from "@/pages/riskChampions/Risks";
import ChampionRegisterRisk from "@/pages/riskChampions/RegisterRisk";
import ViewRisk from "@/pages/riskChampions/ViewRisk";
import SubmitRiskReport from "@/pages/riskChampions/SubmitRiskReport";
import MySubmissions from "@/pages/riskChampions/MySubmissions";
import Profile from "@/pages/riskChampions/Profile";
import Account from "@/pages/riskChampions/Account";

// Risk Coordinator Pages
import CoordinatorLayout from "@/components/layout/CoordinatorLayout";
import Dashboard from "@/pages/riskCoordinator/Dashboard";
import CoordinatorRegisterRisk from "@/pages/riskCoordinator/RegisterRisk";
import RiskChampions from "@/pages/riskCoordinator/RiskChampions";
import GenerateReports from "@/pages/riskCoordinator/GenerateReports";
import Notifications from "@/pages/riskCoordinator/Notifications";

// Committee Pages
import CommitteeLayout from "@/components/layout/CommitteeLayout";
import CommitteeDashboard from "@/pages/riskCommittee/Dashboard";
import RiskHeatmap from "@/pages/riskCommittee/RiskHeatmap";

// DVC Pages
//import DVCDashboard from "./pages/dvc/Dashboard";

// General Pages
//import NotFound from "./pages/NotFound"; // Uncomment if you have a NotFound component

const queryClient = new QueryClient();

const App = () => (
  // All providers should typically wrap the entire application or at least the router
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster /> {/* Single Toaster for the whole app */}
      <UserProvider> {/* UserProvider wraps the BrowserRouter for global access */}
        <BrowserRouter>
          <Routes>
            {/* The Login page is ONLY at the root path "/" */}
            <Route path="/" element={<Login />} />

            {/* Risk Champion Routes - All nested under a single layout */}
            <Route path="/champion" element={<RiskChampionLayout />}>
              <Route path="dashboard" element={<RiskChampionDashboard />} />
              <Route path="risks" element={<Risks />} />
              <Route path="risks/:id" element={<ViewRisk />} />
              <Route path="risks/:id/report" element={<SubmitRiskReport />} />
              <Route path="register-risk" element={<ChampionRegisterRisk />} />
              <Route path="submissions" element={<MySubmissions />} />
              <Route path="profile" element={<Profile />} />
              <Route path="account" element={<Account />} />
            </Route>

            {/* Risk Coordinator Routes - All nested under a single layout */}
            <Route path="/coordinator" element={<CoordinatorLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="risk-champions" element={<RiskChampions />} />
              <Route path="register-risk" element={<CoordinatorRegisterRisk />} />
              <Route path="generate-reports" element={<GenerateReports />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* Committee Routes - All nested under a single layout */}
            <Route path="/committee" element={<CommitteeLayout />}>
              <Route path="dashboard" element={<CommitteeDashboard />} />
              <Route path="risk-heatmap" element={<RiskHeatmap />} />
            </Route>

            {/* DVC Routes (uncomment and add if needed) */}
            {/*<Route path="/dvc/dashboard" element={<DVCDashboard />} />*/}

            {/* Catch-all for 404 Not Found (uncomment if you have NotFound component) */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;