import { useState } from "react";
import { ChevronLeft, ChevronRight, User, Book } from "lucide-react";

const SidebarItem = ({ icon: Icon, label, onClick, isExpanded }) => (
  <div className="w-full">
    <div
      onClick={onClick}
      className="flex items-center cursor-pointer p-2 hover:bg-gray-200"
    >
      <Icon className="w-5 h-5" />
      {isExpanded && <span className="ml-3">{label}</span>}
    </div>
  </div>
);

const AdminSideBar = ({ setActiveTab }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <div
      className={`h-full ${
        isExpanded ? "w-64" : "w-16"
      } flex-shrink-0 bg-gray-50 text-black shadow-lg transition-all duration-300 ease-in-out`}
    >

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
    </div>
  );
};

export default AdminSideBar;
