import { useState } from "react";
import { ChevronLeft, ChevronRight, PlusCircle, FileText, XCircle } from "lucide-react";

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

const UserSidebar = ({ setActiveTab }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`h-full ${
        isExpanded ? "w-64" : "w-16"
      } flex-shrink-0 bg-gray-50 text-black shadow-lg transition-all duration-300 ease-in-out`}
    >
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
        label="View Loan Requests"
        onClick={() => setActiveTab("viewLoanRequests")}
        isExpanded={isExpanded}
      />
    </div>
  );
};

export default UserSidebar;
