function FinanceSidebar({ setActiveTab, activeTab }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex flex-col p-4 space-y-2">
        <button
          onClick={() => setActiveTab("viewLoanRequests")}
          className={`text-left px-3 py-2 rounded ${
            activeTab === "viewLoanRequests"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          View Loan Requests
        </button>

        {/* Add more sidebar items here as needed */}
        {/* Example: */}
        {/* <button
          onClick={() => setActiveTab("someOtherTab")}
          className={`text-left px-3 py-2 rounded ${
            activeTab === "someOtherTab"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          Another Tab
        </button> */}
      </nav>
    </aside>
  );
}

export default FinanceSidebar;
