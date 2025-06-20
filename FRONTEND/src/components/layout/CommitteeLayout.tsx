import { Outlet, Link } from "react-router-dom";

const CommitteeLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-udsm-blue text-white p-6 space-y-4">
        <h2 className="text-xl font-bold">Committee Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/committee/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/committee/risk-heatmap" className="hover:underline">Risk Heatmap</Link>
          <Link to="/committee/mitigation-progress" className="hover:underline">Mitigation Progress</Link>
          <Link to="/committee/trend-analysis" className="hover:underline">Trend Analysis</Link>
          {/* Add more links as needed */}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default CommitteeLayout;
