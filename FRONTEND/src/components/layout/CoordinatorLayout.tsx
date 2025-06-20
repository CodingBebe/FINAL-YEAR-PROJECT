import { Outlet, Link } from "react-router-dom";

const CoordinatorLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-udsm-blue text-white p-6 space-y-4">
        <h2 className="text-xl font-bold">Coordinator Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/coordinator/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/coordinator/register-risk" className="hover:underline">Register Risk</Link>
          <Link to="/coordinator/risk-champions" className="hover:underline">Risk Champions</Link>
          {/*<Link to="/coordinator/generate-reports" className="hover:underline">Generate Reports</Link>
          <Link to="/coordinator/notifications" className="hover:underline">Notifications</Link>*/}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default CoordinatorLayout;
