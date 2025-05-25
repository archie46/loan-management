import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  FileText,
  XCircle,
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, onClick, isExpanded }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full p-3 text-left rounded-lg hover:bg-blue-100 transition"
  >
    <Icon className="w-5 h-5 text-blue-600" />
    {isExpanded && <span className="ml-3 text-sm font-medium text-gray-800">{label}</span>}
  </button>
);

const UserSidebar = ({ setActiveTab }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`h-full ${
        isExpanded ? "w-64" : "w-16"
      } bg-white shadow-md transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        {isExpanded && <span className="text-lg font-bold text-gray-700">Menu</span>}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-200 rounded transition"
        >
          {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        <SidebarItem
          icon={PlusCircle}
          label="Apply Loan"
          onClick={() => setActiveTab("applyLoan")}
          isExpanded={isExpanded}
        />
        <SidebarItem
          icon={FileText}
          label="View Repayments"
          onClick={() => setActiveTab("repayments")}
          isExpanded={isExpanded}
        />
        <SidebarItem
          icon={XCircle}
          label="Loan Requests"
          onClick={() => setActiveTab("viewLoanRequests")}
          isExpanded={isExpanded}
        />
      </nav>
    </aside>
  );
};

export default UserSidebar;
