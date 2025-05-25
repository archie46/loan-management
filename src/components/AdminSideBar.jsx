import { useState } from "react";
import { ChevronLeft, ChevronRight, User, Book } from "lucide-react";

/**
 * Single Sidebar item with icon and label.
 * @param {React.Component} icon - Icon component to render.
 * @param {string} label - Text label for the item.
 * @param {function} onClick - Click handler for item.
 * @param {boolean} isExpanded - Sidebar expanded state.
 */
const SidebarItem = ({ icon: Icon, label, onClick, isExpanded }) => (
  <div className="w-full">
    <button
      onClick={onClick}
      className="flex items-center w-full cursor-pointer p-3 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none rounded transition"
      aria-label={label}
      title={label}
      tabIndex={0}
    >
      <Icon className="w-5 h-5 text-blue-600" aria-hidden="true" />
      {isExpanded && <span className="ml-4 font-medium text-gray-700">{label}</span>}
    </button>
  </div>
);

/**
 * Admin Sidebar component with expandable/collapsible feature.
 * @param {function} setActiveTab - Setter for active tab in dashboard.
 */
const AdminSideBar = ({ setActiveTab }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-white text-gray-900 shadow-lg border-r border-gray-200 transition-width duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <nav className="flex flex-col mt-6 space-y-1 px-2">
        <SidebarItem
          icon={User}
          label="Users"
          onClick={() => setActiveTab("users")}
          isExpanded={isExpanded}
        />
        <SidebarItem
          icon={Book}
          label="Loans"
          onClick={() => setActiveTab("loans")}
          isExpanded={isExpanded}
        />
      </nav>

      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="self-end m-3 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </aside>
  );
};

export default AdminSideBar;
