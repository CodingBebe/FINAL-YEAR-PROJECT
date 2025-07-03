import { Outlet, Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const CoordinatorLayout = () => {
  const { user } = useUser();
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex flex-col items-center w-64 min-h-screen bg-[#1a3353] py-8">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center text-2xl text-white font-bold mb-2">
            {user.initials || (user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?')}
          </div>
          <div className="text-white font-semibold text-lg">{user.name || 'User'}</div>
          <div className="text-gray-300 text-sm">{user.role || 'Role'}</div>
        </div>
        <hr className="border-t border-blue-800 w-4/5 mb-6" />
        {/* Menu */}
        <nav className="flex flex-col gap-6 w-full px-8">
          <Link to="/coordinator/dashboard" className="flex items-center text-gray-200 gap-3">
            <span className="text-xl">🏠</span>
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/coordinator/register-risk" className="flex items-center text-gray-200 gap-3">
            <span className="text-xl">📝</span>
            <span className="font-medium">Register Risk</span>
          </Link>
          <Link to="/coordinator/risk-champions" className="flex items-center text-gray-200 gap-3">
            <span className="text-xl">👥</span>
            <span className="font-medium">Risk Champions</span>
          </Link>
          <Link to="/coordinator/submissions" className="flex items-center text-gray-200 gap-3">
            <span className="text-xl">📄</span>
            <span className="font-medium">View Submissions</span>
          </Link>
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
