import { FaMoneyCheckAlt } from "react-icons/fa";

function FinanceSidebar({ setActiveTab, activeTab }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-md">
      <nav className="flex flex-col p-6 space-y-3">
        <button
          onClick={() => setActiveTab("viewLoanRequests")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
            activeTab === "viewLoanRequests"
              ? "bg-blue-600 text-white shadow-lg"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
          }`}
          aria-current={activeTab === "viewLoanRequests" ? "page" : undefined}
        >
          <FaMoneyCheckAlt size={20} />
          View Loan Requests
        </button>

        {/* Add more sidebar items here */}
      </nav>
    </aside>
  );
}

export default FinanceSidebar;
