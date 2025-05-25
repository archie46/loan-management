import { Menu, User } from "lucide-react";

/**
 * Navbar component for the top header bar.
 * @param {function} onToggleSidebar - Callback to toggle sidebar visibility.
 */
const Navbar = ({ onToggleSidebar }) => {
  const username = localStorage.getItem("username") || "Guest";

  return (
    <header className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white flex items-center justify-between px-6 py-3 shadow-md">
      {/* Left: Sidebar toggle button and title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="text-white hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white rounded"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold tracking-wide select-none">Dashboard</h1>
      </div>

      {/* Right: User info and logout button */}
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-white" aria-hidden="true" />
          <span className="font-medium select-none">{username}</span>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
          aria-label="Logout"
          title="Logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
